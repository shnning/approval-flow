# 审批流(点击该地址访问：https://shnning.github.io/approval-flow/)
基于dag(有向无环图)数据结构的审批流程图，思路是将dag转成Tree，流程绘制基于[此仓库](https://github.com/StavinLi/Workflow)和[此仓库](https://github.com/cedrusweng/workflow-react)。

# 项目启动
```bash
yarn
yarn start
```

# 数据结构定义
```typescript
interface DagNode {
  id: string;
  type: string;
  name: string;
}

interface DagLine {
  id: string;
  src_node_id: string;
  dst_node_id: string;
  name?: string;
  priority?: number;
}
```
具体定义可查看[此文件](./src/approvalFlow/types/index.ts)，示例数据可查[看此文件](./src/approvalFlow/__test__/data)。

# 文件结构
```bash
.
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.scss
│   ├── App.tsx
│   ├── approvalFlow 核心逻辑
│   ├── assets
│   ├── components
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
│   └── store
├── tsconfig.json
└── yarn.lock
```

# TODO
- [ ] 集成测试
- [ ] 继续拆分并重构core/index.ts文件
- [ ] 重构组件
- [ ] 数据绑定
- [ ] debug模式(展示node id)
