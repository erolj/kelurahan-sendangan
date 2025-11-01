"use client"

import { useCallback, useEffect, useState, useRef } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeMouseHandler,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import StructureNode from './structure-node'
import FloatingToolbar from './floating-toolbar'
import { getLayoutedElements } from '@/lib/structure-layout'
import { useToast } from '@/hooks/use-toast'

type StructureMember = {
  id: string
  jabatan: string
  nama: string
  nip: string | null
  fotoUrl: string | null
  positionX: number
  positionY: number
  parentId: string | null
}

type StructureCanvasProps = {
  members: StructureMember[]
  onRefresh: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const nodeTypes = {
  structureNode: StructureNode,
}

export default function StructureCanvas({
  members,
  onRefresh,
  onEdit,
  onDelete,
}: StructureCanvasProps) {
  const { toast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const calculateLevel = useCallback((memberId: string, allMembers: StructureMember[]): number => {
    const member = allMembers.find(m => m.id === memberId)
    if (!member || !member.parentId) return 0
    return 1 + calculateLevel(member.parentId, allMembers)
  }, [])

  const buildNodesAndEdges = useCallback((membersList: StructureMember[]) => {
    const newNodes: Node[] = membersList.map((member) => ({
      id: member.id,
      type: 'structureNode',
      position: { x: member.positionX, y: member.positionY },
      data: {
        id: member.id,
        jabatan: member.jabatan,
        nama: member.nama,
        nip: member.nip,
        fotoUrl: member.fotoUrl,
        level: calculateLevel(member.id, membersList),
      },
    }))

    const newEdges: Edge[] = membersList
      .filter(m => m.parentId)
      .map(m => ({
        id: `${m.parentId}-${m.id}`,
        source: m.parentId!,
        target: m.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      }))

    return { nodes: newNodes, edges: newEdges }
  }, [calculateLevel])

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildNodesAndEdges(members)
    
    const needsLayout = members.length > 0 && members.every(m => m.positionX === 0 && m.positionY === 0)
    
    if (needsLayout) {
      const { nodes: layoutedNodes } = getLayoutedElements(newNodes, newEdges)
      setNodes(layoutedNodes)
      setEdges(newEdges)
      
      saveAllPositions(layoutedNodes)
    } else {
      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [members, buildNodesAndEdges, setNodes, setEdges])

  const saveAllPositions = async (nodesToSave: Node[]) => {
    try {
      await Promise.all(
        nodesToSave.map(node =>
          fetch(`/api/admin/structure/${node.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              positionX: node.position.x,
              positionY: node.position.y,
            }),
          })
        )
      )
    } catch (error) {
      console.error('Failed to save positions:', error)
    }
  }

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node.id)
    
    const rect = reactFlowWrapper.current?.getBoundingClientRect()
    if (rect) {
      setToolbarPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleNodesChangeWithSave: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    
    const positionChanges = changes.filter(c => c.type === 'position' && c.dragging === false)
    if (positionChanges.length > 0) {
      positionChanges.forEach(async (change) => {
        if (change.type === 'position' && change.position) {
          try {
            await fetch(`/api/admin/structure/${change.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                positionX: change.position.x,
                positionY: change.position.y,
              }),
            })
          } catch (error) {
            console.error('Failed to save position:', error)
          }
        }
      })
    }
  }, [onNodesChange])

  const handleConnect: OnConnect = useCallback(async (connection: Connection) => {
    if (!connection.source || !connection.target) return
    
    if (connection.source === connection.target) {
      toast({
        title: 'Error',
        description: 'Tidak bisa menghubungkan node ke dirinya sendiri',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch(`/api/admin/structure/${connection.target}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId: connection.source,
        }),
      })

      if (res.ok) {
        setEdges((eds) => addEdge(connection, eds))
        toast({
          title: 'Berhasil',
          description: 'Koneksi berhasil dibuat',
        })
        onRefresh()
      } else {
        throw new Error('Failed to connect')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal membuat koneksi',
        variant: 'destructive',
      })
    }
  }, [setEdges, toast, onRefresh])

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChangeWithSave}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
      </ReactFlow>
      
      {selectedNode && (
        <FloatingToolbar
          nodeId={selectedNode}
          position={toolbarPosition}
          onEdit={() => {
            onEdit(selectedNode)
            setSelectedNode(null)
          }}
          onDelete={() => {
            onDelete(selectedNode)
            setSelectedNode(null)
          }}
        />
      )}
    </div>
  )
}
