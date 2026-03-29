import {
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from "./select";

export function App() {
  return (
    <div className="container p-4">
      <h1>Select Component</h1>
      <br />
      <Select className="max-w-md" name="country">
        <SelectLabel>Country</SelectLabel>
        <SelectTrigger>
          <SelectValue>Select a Country</SelectValue>
        </SelectTrigger>
        <SelectList>
          <SelectOption value={undefined}>Select a Country</SelectOption>
          <SelectOption value="US">United States of America</SelectOption>
          <SelectOption value="CA">Canada</SelectOption>
          <SelectOption value="MX">Mexico</SelectOption>
          <SelectOption disabled value="CU">
            Cuba
          </SelectOption>
        </SelectList>
      </Select>
    </div>
  );
}
