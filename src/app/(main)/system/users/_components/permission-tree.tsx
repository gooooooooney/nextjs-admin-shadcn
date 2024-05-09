import { Icons } from '@/components/icons';
import React from 'react'
import CheckboxTree, { type Node } from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import "./permission-tree.css";
import { useUsersTable } from './users-table-provider';
import { getMenuHierarchy } from '@/lib/array-util';
import { MenuWithValue } from '@/types/model/menu';
import { MenuStatus } from '@/drizzle/schema';

type PermissionTreeProps = {
  nodes: MenuWithValue[]
  checked: string[]
  setChecked: (checked: string[]) => void
}

function removeEmptyChildren(nodes: Node[]) {
  return nodes.map(node => {
    // 如果节点有 children 属性且其长度不为 0
    if (node.children && node.children.length > 0) {
      // 递归调用以处理子节点
      node.children = removeEmptyChildren(node.children);
      // 如果递归处理后 children 为空，则删除 children 属性
      if (node.children.length === 0) {
        delete node.children;
      }
    } else {
      // 如果 children 属性为空或不存在，直接删除该属性
      delete node.children;
    }
    // 返回处理后的节点
    return node;
  });
}

export const PermissionTree = ({ nodes, checked, setChecked }: PermissionTreeProps) => {

  const [expanded, setExpanded] = React.useState<string[]>([]);
  const { menus } = useUsersTable()
  const menuList = React.useMemo(() => {
    const list = menus.map(menu => {
      const node = nodes.find(item => item.value === menu.value)
      
      return {
        id: menu.id,
        label: menu.label,
        value: menu.value,
        parentId: menu.parentId!,
        disabled: node?.status === MenuStatus.Enum.inactive
      }
    })
    return getMenuHierarchy(list)
  }, [menus, nodes])
  return (
    <CheckboxTree
      icons={{
        expandClose: <Icons.ChevronRight className=" rct-icon rct-icon-expand-close" />,
        expandOpen: <Icons.ChevronDown className=" rct-icon rct-icon-expand-open" />,
        check: <Icons.SquareCheck className=" rct-icon rct-icon-check" />,
        uncheck: <Icons.Square className=" rct-icon rct-icon-uncheck" />,
        halfCheck: <Icons.SquareMinus className=" rct-icon rct-icon-half-check" />,
        parentClose: null,
        parentOpen: null,
        leaf: null,
      }}
      // It's not working
      checkModel='all'
      showExpandAll
      nodes={removeEmptyChildren(menuList)}
      checked={checked}
      expanded={expanded}
      onCheck={(checked) => setChecked(checked)}
      onExpand={(expanded) => setExpanded(expanded)}
    />
  )
}
