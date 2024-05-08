import React from 'react'
import CheckboxTree from 'react-checkbox-tree';


export const PermissionTree = () => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);
  return (
    <CheckboxTree
      nodes={[
        {
          value: 'mars',
          label: 'Mars',
          children: [
            { value: 'phobos', label: 'Phobos' },
            { value: 'deimos', label: 'Deimos' },
          ],
        },
      ]}
      checked={checked}
      expanded={expanded}
      onCheck={(checked) => setChecked(checked)}
      onExpand={(expanded) => setExpanded(expanded)}
    />
  )
}
