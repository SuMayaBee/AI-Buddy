import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Message } from "@/types"

interface TokenUsageDisplayProps {
  messages: Message[]
}

export function TokenUsageDisplay({ messages }: TokenUsageDisplayProps) {
  return (
    <>
    { messages.length > 0 && (
    <Accordion type="single" collapsible key="token-usage" className="w-full">
      <AccordionItem value="token-usage">
        <AccordionTrigger>
          <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent>
              <div className="space-y-1 mt-4">
                {messages
                  .filter((msg) => msg.type === 'response.done')
                  .slice(-1)
                  .map((msg) => (
                    <Table key="token-usage-table">
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Total Tokens</TableCell>
                          <TableCell>{msg.response?.usage?.total_tokens}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Input Tokens</TableCell>
                          <TableCell>{msg.response?.usage?.input_tokens}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Output Tokens</TableCell>
                          <TableCell>{msg.response?.usage?.output_tokens}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ))}
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    )
  }
  </>
  )
} 