/* ============================================================
   NGUGI FAMILY PORTAL — Interactive Family Tree
   ============================================================ */

const Tree = {
  expandedNodes: new Set(),
  container: null,
  onSelect: null,

  init(containerId, onSelectCb) {
    this.container = document.getElementById(containerId);
    this.onSelect = onSelectCb || (() => {});
    this.render();
  },

  render() {
    if (!this.container) return;
    const members = Members.all();
    // Find roots (founders / no parent)
    const roots = members.filter(m => !m.parentId);
    this.container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'tree-wrap';

    // Founders row
    const foundersSection = this._buildGenSection('Founders — Generation 1', roots);
    wrap.appendChild(foundersSection);

    // G2 row (children of founders)
    const g2 = members.filter(m => roots.some(r => r.id === m.parentId));
    if (g2.length) {
      const connector = document.createElement('div');
      connector.className = 'tree-connector-v';
      wrap.appendChild(connector);
      const g2Section = this._buildGenSection("Ngugi's Children — Generation 2", g2, true);
      wrap.appendChild(g2Section);
    }

    this.container.appendChild(wrap);
  },

  _buildGenSection(label, members, expandable = false) {
    const section = document.createElement('div');
    section.className = 'tree-gen-section';

    const lbl = document.createElement('div');
    lbl.className = 'tree-gen-label';
    lbl.textContent = label;
    section.appendChild(lbl);

    const row = document.createElement('div');
    row.className = 'tree-gen-row';

    members.forEach(m => {
      const col = document.createElement('div');
      col.className = 'tree-member-col';

      const chip = this._buildChip(m);
      col.appendChild(chip);

      // Children sub-tree (collapsible)
      const children = Members.children(m.id);
      if (children.length) {
        const sub = document.createElement('div');
        sub.className = 'tree-subtree';
        sub.id = 'sub_' + m.id;
        sub.style.display = this.expandedNodes.has(m.id) ? 'block' : 'none';

        const subLabel = document.createElement('div');
        subLabel.className = 'tree-sub-label';
        subLabel.textContent = `Children of ${m.name}`;
        sub.appendChild(subLabel);

        const subRow = document.createElement('div');
        subRow.className = 'tree-gen-row tree-gen-row--sub';

        children.forEach(child => {
          const childCol = document.createElement('div');
          childCol.className = 'tree-member-col';
          const childChip = this._buildChip(child);
          childCol.appendChild(childChip);

          // Grandchildren
          const grandkids = Members.children(child.id);
          if (grandkids.length) {
            const gsub = document.createElement('div');
            gsub.className = 'tree-subtree';
            gsub.id = 'sub_' + child.id;
            gsub.style.display = this.expandedNodes.has(child.id) ? 'block' : 'none';
            const gSubLabel = document.createElement('div');
            gSubLabel.className = 'tree-sub-label';
            gSubLabel.textContent = `Children of ${child.name}`;
            gsub.appendChild(gSubLabel);
            const gSubRow = document.createElement('div');
            gSubRow.className = 'tree-gen-row tree-gen-row--sub';

            grandkids.forEach(gc => {
              const gcCol = document.createElement('div');
              gcCol.className = 'tree-member-col';
              const gcChip = this._buildChip(gc);
              gcCol.appendChild(gcChip);

              // Great-grandchildren
              const ggkids = Members.children(gc.id);
              if (ggkids.length) {
                const ggsub = document.createElement('div');
                ggsub.className = 'tree-subtree';
                ggsub.id = 'sub_' + gc.id;
                ggsub.style.display = this.expandedNodes.has(gc.id) ? 'block' : 'none';
                const ggSubLabel = document.createElement('div');
                ggSubLabel.className = 'tree-sub-label';
                ggSubLabel.textContent = `Children of ${gc.name}`;
                ggsub.appendChild(ggSubLabel);
                const ggRow = document.createElement('div');
                ggRow.className = 'tree-gen-row tree-gen-row--sub';
                ggkids.forEach(gg => {
                  const ggCol = document.createElement('div');
                  ggCol.className = 'tree-member-col';
                  ggCol.appendChild(this._buildChip(gg));
                  ggRow.appendChild(ggCol);
                });
                ggsub.appendChild(ggRow);
                gcCol.appendChild(ggsub);
              }

              gcCol.appendChild(gcChip);
              gSubRow.appendChild(gcCol);
            });
            gsub.appendChild(gSubRow);
            childCol.appendChild(gsub);
          }

          subRow.appendChild(childCol);
        });

        sub.appendChild(subRow);
        col.appendChild(sub);
      }

      row.appendChild(col);
    });

    section.appendChild(row);
    return section;
  },

  _buildChip(m) {
    const allMembers = Members.all();
    const childCount = allMembers.filter(c => c.parentId === m.id).length;
    const hasChildren = childCount > 0;
    const isExpanded = this.expandedNodes.has(m.id);

    const chip = document.createElement('div');
    chip.className = 'tree-chip' + (m.status === 'deceased' ? ' tree-chip--deceased' : '');
    chip.dataset.id = m.id;

    const bg = genBg(m.generation);
    const fg = genColor(m.generation);

    chip.innerHTML = `
      <div class="tree-chip-av" style="background:${bg};color:${fg}">${Members.initials(m.name)}</div>
      <div class="tree-chip-name">${m.name}</div>
      ${m.status === 'deceased' ? '<div class="tree-chip-meta">✝</div>' : ''}
      ${hasChildren ? `<div class="tree-chip-count" style="background:${bg};color:${fg}">${childCount}</div>` : ''}
      ${hasChildren ? `<button class="tree-expand-btn" data-id="${m.id}" title="${isExpanded ? 'Collapse' : 'Expand'}">${isExpanded ? '▲' : '▼'}</button>` : ''}
    `;

    chip.addEventListener('click', (e) => {
      if (e.target.classList.contains('tree-expand-btn') || e.target.closest('.tree-expand-btn')) {
        e.stopPropagation();
        this._toggle(m.id);
        return;
      }
      this.onSelect(m);
      this._highlight(chip);
    });

    return chip;
  },

  _toggle(id) {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }
    this.render();
  },

  _highlight(chip) {
    document.querySelectorAll('.tree-chip--selected').forEach(c => c.classList.remove('tree-chip--selected'));
    chip.classList.add('tree-chip--selected');
  },
};
