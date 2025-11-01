"use client"

import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import StructureNode from '@/app/admin/struktur/components/structure-node'
import { getLayoutedElements } from '@/lib/structure-layout'

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

type PublicStructureCanvasProps = {
  members: StructureMember[]
}

const nodeTypes = {
  structureNode: StructureNode,
}

export default function PublicStructureCanvas({ members }: PublicStructureCanvasProps) {
  const [nodes, setNodes] = useNodesState<Node>([])
  const [edges, setEdges] = useEdgesState<Edge>([])

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
      draggable: false,
      selectable: false,
      connectable: false,
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
        selectable: false,
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
    } else {
      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [members, buildNodesAndEdges, setNodes, setEdges])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        fitView
        fitViewOptions={{
          padding: 0.15,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1,
        }}
        minZoom={0.3}
        maxZoom={1}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  )
}
