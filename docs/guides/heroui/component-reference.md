# 常用组件配置参考

## Button

```tsx
import { Button } from '@heroui/react'
import { ArrowRight } from 'lucide-react'

// 主要按钮
<Button color="primary" radius="full">
  提交
</Button>

// 次要按钮
<Button variant="bordered" radius="full">
  取消
</Button>

// 带图标
<Button color="primary" radius="full" endContent={<ArrowRight size={16} />}>
  下一步
</Button>

// 加载状态
<Button color="primary" radius="full" isLoading>
  提交中
</Button>

// 禁用状态
<Button color="primary" radius="full" isDisabled>
  不可用
</Button>

// 链接按钮
import { Link as RouterLink } from 'react-router-dom'
<Button as={RouterLink} to="/login" color="primary" radius="full">
  去登录
</Button>
```

---

## Input

```tsx
import { Input } from '@heroui/react'
import { Mail, Eye, EyeOff } from 'lucide-react'

// 基础输入框
<Input
  type="email"
  variant="bordered"
  radius="full"
  label="邮箱"
  placeholder="请输入邮箱"
/>

// 带前置图标
<Input
  variant="bordered"
  radius="full"
  placeholder="请输入邮箱"
  startContent={<Mail size={18} className="text-default-400" />}
/>

// 密码输入框（带切换可见性）
const [isVisible, setIsVisible] = useState(false)

<Input
  type={isVisible ? 'text' : 'password'}
  variant="bordered"
  radius="full"
  label="密码"
  endContent={
    <button
      type="button"
      onClick={() => setIsVisible(!isVisible)}
      className="text-default-400 hover:text-default-600"
    >
      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>

// 错误状态
<Input
  variant="bordered"
  radius="full"
  isInvalid
  errorMessage="邮箱格式不正确"
/>
```

---

## Checkbox

```tsx
import { Checkbox } from '@heroui/react'

// 基础复选框
<Checkbox
  size="sm"
  radius="full"
  classNames={{
    label: 'text-sm text-default-500',
  }}
>
  记住我
</Checkbox>

// 带链接的复选框
<Checkbox size="sm" radius="full">
  <span className="text-sm text-default-500">
    我已阅读并同意
    <Link href="/terms" color="primary" size="sm">
      服务条款
    </Link>
  </span>
</Checkbox>
```

---

## Link

```tsx
import { Link } from '@heroui/react'
import { Link as RouterLink } from 'react-router-dom'

// 内部链接（配合 React Router）
<Link as={RouterLink} to="/login" color="primary" size="sm">
  登录
</Link>

// 外部链接
<Link href="https://example.com" isExternal color="primary">
  了解更多
</Link>

// 下划线链接
<Link href="/forgot-password" color="primary" underline="always" size="sm">
  忘记密码？
</Link>
```

---

## Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react'

// 基础卡片
<Card className="p-6">
  <CardHeader>
    <h3 className="text-xl font-semibold">标题</h3>
  </CardHeader>
  <CardBody>
    内容
  </CardBody>
</Card>

// 带阴影的卡片
<Card shadow="md" className="p-6">
  内容
</Card>

// 注意：Card 不要使用 radius="full"，保持默认圆角
```

---

## Dropdown（用户菜单）

```tsx
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'

;<Dropdown>
  <DropdownTrigger>
    <Button variant="light" endContent={<ChevronDown size={16} />}>
      用户名
    </Button>
  </DropdownTrigger>
  <DropdownMenu aria-label="用户菜单">
    <DropdownItem key="profile" startContent={<User size={16} />}>
      个人中心
    </DropdownItem>
    <DropdownItem key="settings" startContent={<Settings size={16} />}>
      设置
    </DropdownItem>
    <DropdownItem key="logout" startContent={<LogOut size={16} />} color="danger" className="text-danger">
      退出登录
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```

---

## Divider

```tsx
import { Divider } from '@heroui/react'

// 水平分割线
<Divider className="my-4" />

// 带文字的分割线
<div className="flex items-center gap-4">
  <Divider className="flex-1" />
  <span className="text-default-400 text-sm">或</span>
  <Divider className="flex-1" />
</div>
```

---

## Accordion（FAQ 场景）

```tsx
import { Accordion, AccordionItem } from '@heroui/react'

;<Accordion>
  <AccordionItem key="1" aria-label="问题1" title="这是第一个问题？">
    这是答案内容。
  </AccordionItem>
  <AccordionItem key="2" aria-label="问题2" title="这是第二个问题？">
    这是答案内容。
  </AccordionItem>
</Accordion>
```

---

## 常见 Props 速查

| Prop      | 可选值                                                                 | 说明     |
| --------- | ---------------------------------------------------------------------- | -------- |
| `color`   | `default` / `primary` / `secondary` / `success` / `warning` / `danger` | 语义颜色 |
| `variant` | `solid` / `bordered` / `light` / `flat` / `faded` / `ghost`            | 变体样式 |
| `radius`  | `none` / `sm` / `md` / `lg` / `full`                                   | 圆角大小 |
| `size`    | `sm` / `md` / `lg`                                                     | 尺寸     |

---

## 项目约定

| 组件     | 默认 radius | 默认 variant | 说明                       |
| -------- | ----------- | ------------ | -------------------------- |
| Button   | `full`      | `solid`      | 全圆角按钮                 |
| Input    | `full`      | `bordered`   | 全圆角带边框输入框         |
| Checkbox | `full`      | -            | 全圆角复选框               |
| Card     | 默认        | -            | 保持 HeroUI 默认圆角       |
| Link     | -           | -            | 主要使用 `color="primary"` |
