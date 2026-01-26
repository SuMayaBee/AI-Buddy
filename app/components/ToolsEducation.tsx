import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

const AVAILABLE_TOOLS = [
  {
    name: "Copy Fn",
    description: 'Say "Copy that to clipboard" to paste it somewhere.',
  },
  {
    name: "Get Time",
    description: 'Ask "Tell me what time is it?" to get current time.',
  },
  {
    name: "Theme Switcher",
    description: 'Say "Change background" or "Switch to dark mode" or "Switch to light mode".',
  },
  {
    name: "Party Mode",
    description: 'Say "Start party mode" for a fun color animation!',
  },
  {
    name: "Launch Website",
    description: '"Take me to [website]" to launch a site in a new tab.',
  },
] as const;

export function ToolsEducation() {
  return (
    <div className="w-full max-w-lg mt-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="tools">
          <AccordionTrigger>Available Tools</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                {AVAILABLE_TOOLS.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tool.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 