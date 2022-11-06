console.log('Hello World');

function square(x) {
  return x * x;
}

// 这里的备注不会被打包进去
export function cube(x) {
  return x * x * x;
}
