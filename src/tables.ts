export const availableTables = [
  {
    id: "users",
    name: "Users",
    description: "User accounts and profiles",
    schema: [
      { name: "id", type: "number", readOnly: true },
      { name: "full_name", type: "text" },
      { name: "email", type: "email" },
      { name: "role", type: "select", options: ["Admin", "Editor", "Viewer"] },
    ],
  },
  {
    id: "products",
    name: "Products",
    description: "Product catalog and inventory",
    schema: [
      { name: "id", type: "number", readOnly: true },
      { name: "name", type: "text" },
      { name: "price", type: "number" },
      { name: "in_stock", type: "boolean" },
    ],
  },
  {
    id: "orders",
    name: "Orders",
    description: "Customer orders and transactions",
    schema: [
      { name: "id", type: "number", readOnly: true },
      { name: "customer_id", type: "number" },
      { name: "order_date", type: "date" },
      {
        name: "status",
        type: "select",
        options: ["Pending", "Shipped", "Delivered", "Cancelled"],
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Usage statistics and metrics",
    schema: [
      { name: "event_id", type: "text", readOnly: true },
      { name: "event_name", type: "text" },
      { name: "timestamp", type: "datetime" },
      { name: "user_id", type: "number" },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    description: "Application configuration",
    schema: [
      { name: "key", type: "text", readOnly: true },
      { name: "value", type: "text" },
      { name: "description", type: "textarea" },
    ],
  },
];
