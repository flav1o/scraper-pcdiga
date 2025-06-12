import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";

export const StorePicker = () => {
    return (
      <Select>
        <SelectTrigger className="w-[180px] h-[30px]">
          <SelectValue placeholder="Select a Store" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="pcdiga">Pc Diga</SelectItem>
            <SelectItem value="worten">Worten</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
}