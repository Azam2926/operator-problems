"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCommutators } from "@/lib/actions";

interface CommutatorComboboxProps {
  operator: string;
  value: string;
  onChange: (value: string) => void;
}

export function CommutatorCombobox({
  operator,
  value,
  onChange,
}: CommutatorComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCommutators() {
      try {
        setLoading(true);
        const result = await getCommutators(operator);
        if (result.success) {
          setOptions(result.data);
          if (result.data.length > 0) {
            onChange(result.data[0]);
          } else onChange("");
        }
      } catch (error) {
        console.error("Failed to load commutators:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCommutators();
  }, [operator]);

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {value ? value : "Select commutator..."}
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search commutator..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading commutators...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No commutator found.</CommandEmpty>
                <CommandGroup value={inputValue} heading="Existing Commutators">
                  {options.map((option, index) => (
                    <CommandItem
                      key={index}
                      value={option}
                      onSelect={() => {
                        onChange(option);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {inputValue &&
                  !options.some((option) => option === inputValue) && (
                    <>
                      <CommandSeparator />
                      <CommandGroup heading="Create New">
                        <CommandItem onSelect={handleCreateNew}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create &#34;{inputValue}&#34;
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
