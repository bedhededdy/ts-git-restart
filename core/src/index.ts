import { ecp123 } from "./bar";

export default function foo(): string {
  return "foo" + ecp123();
}

export function bar(): string {
  return "bar";
}
