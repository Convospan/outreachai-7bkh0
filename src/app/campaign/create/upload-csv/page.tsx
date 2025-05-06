'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileUp, ArrowLeft, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CsvRow {
  [key: string]: string;
}

export default function UploadCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        parseCsv(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid .csv file.",
          variant: "destructive",
        });
        setFile(null);
        setFileName('');
        setParsedData([]);
        setHeaders([]);
      }
    }
  };

  const parseCsv = (csvFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== ''); // Filter out empty lines
        if (lines.length > 0) {
          const firstLine = lines[0].split(',');
          setHeaders(firstLine.map(header => header.trim()));
          
          const data: CsvRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row: CsvRow = {};
            firstLine.forEach((header, index) => {
              row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
          }
          setParsedData(data);
          if (data.length > 0) {
            toast({
              title: "CSV Parsed Successfully",
              description: `${data.length} rows of data loaded (excluding header).`,
            });
          } else {
             toast({
              title: "Empty CSV or Header Only",
              description: "The CSV file seems to be empty or contains only a header.",
              variant: "warning",
            });
          }
        } else {
           toast({
            title: "Empty CSV File",
            description: "The uploaded CSV file is empty.",
            variant: "warning",
          });
        }
      }
    };
    reader.readAsText(csvFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }
    // Placeholder for actual API call
    // In a real app, you'd use FormData to send the file to an API endpoint
    // For example:
    // const formData = new FormData();
    // formData.append('file', file);
    // try {
    //   const response = await axios.post('/api/campaign/upload-csv', formData);
    //   toast({ title: "Success", description: "CSV uploaded successfully!" });
    //   // Handle response, navigate or show success message
    // } catch (error) {
    //   toast({ title: "Error", description: "Failed to upload CSV.", variant: "destructive" });
    // }
    toast({
      title: "Upload Simulated",
      description: `File "${fileName}" would be uploaded. Parsed ${parsedData.length} rows.`,
    });
    console.log('Simulating upload of:', parsedData);
    // Here you would typically send `parsedData` or the raw `file` to your backend
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl shadow-2xl drop-shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileUp className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Upload Prospect CSV</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Upload a CSV file containing your prospect data. Ensure the first row contains headers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="csv-file" className="text-lg font-semibold">Select CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="py-3 h-auto text-base" />
            {fileName && <p className="text-sm text-muted-foreground mt-2">Selected file: {fileName}</p>}
          </div>
          
          {parsedData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2 text-primary flex items-center"><Table className="mr-2 h-5 w-5" /> Data Preview (First 5 Rows)</h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      {headers.map((header) => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {parsedData.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((header) => (
                          <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3" size="lg">
            <FileUp className="mr-2 h-5 w-5" /> Upload and Process CSV
          </Button>

          <div className="text-center mt-6">
            <Link href="/campaign/create" passHref>
              <Button variant="outline">
                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaign Creation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
