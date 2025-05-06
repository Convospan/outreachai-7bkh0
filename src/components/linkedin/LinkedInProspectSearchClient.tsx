
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, User, Building, MapPin, Languages, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface FilterState {
  keywords: string;
  industries: string[];
  locations: string[];
  companies: string[];
  profileLanguages: string[];
}

interface LinkedInProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  profileUrl: string;
  imageUrl?: string;
}

// Sample data - replace with actual API calls
const sampleIndustries = ["Technology", "Marketing", "Sales", "Healthcare", "Finance", "Education"];
const sampleLocations = ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, DE", "Bangalore, IN"];
const sampleCompanies = ["Google", "Microsoft", "Apple", "Amazon", "Facebook"];
const sampleLanguages = ["English", "Spanish", "German", "French", "Hindi"];

const sampleProfiles: LinkedInProfile[] = [
  { id: '1', name: 'Jane Doe', headline: 'Software Engineer at Tech Corp', location: 'San Francisco, CA', profileUrl: '#', imageUrl: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'John Smith', headline: 'Marketing Manager at Ad Agency', location: 'New York, NY', profileUrl: '#', imageUrl: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Alice Brown', headline: 'Sales Director at StartupX', location: 'London, UK', profileUrl: '#', imageUrl: 'https://picsum.photos/100/100?random=3' },
];

export default function LinkedInProspectSearchClient() {
  const [filters, setFilters] = useState<FilterState>({
    keywords: '',
    industries: [],
    locations: [],
    companies: [],
    profileLanguages: [],
  });
  const [searchResults, setSearchResults] = useState<LinkedInProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, keywords: e.target.value }));
  };

  const handleCheckboxChange = (category: keyof Omit<FilterState, 'keywords'>, value: string) => {
    setFilters(prev => {
      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handleSearch = async () => {
    setIsLoading(true);
    console.log('Searching with filters:', filters);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you would make an API call to your backend, which then queries LinkedIn API
    // For now, we'll just use the sample profiles if keywords match, or show all if no keywords.
    if (filters.keywords) {
        setSearchResults(sampleProfiles.filter(p => 
            p.name.toLowerCase().includes(filters.keywords.toLowerCase()) || 
            p.headline.toLowerCase().includes(filters.keywords.toLowerCase())
        ));
    } else {
        setSearchResults(sampleProfiles);
    }
    setIsLoading(false);
  };

  const renderCheckboxGroup = (title: string, category: keyof Omit<FilterState, 'keywords'>, options: string[], Icon: React.ElementType) => (
    <AccordionItem value={category}>
      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
        <div className="flex items-center">
          <Icon className="mr-2 h-5 w-5 text-primary" />
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ScrollArea className="h-48 pr-4">
          <div className="space-y-2">
            {options.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${option}`}
                  checked={(filters[category] as string[]).includes(option)}
                  onCheckedChange={() => handleCheckboxChange(category, option)}
                />
                <Label htmlFor={`${category}-${option}`} className="font-normal text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filter Sidebar */}
      <Card className="w-full md:w-1/3 lg:w-1/4 shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Filters</CardTitle>
          <CardDescription>Refine your prospect search.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <Label htmlFor="keywords" className="text-lg font-semibold flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" /> Keywords
            </Label>
            <Input
              id="keywords"
              placeholder="e.g., Software Engineer, Marketing Manager"
              value={filters.keywords}
              onChange={handleKeywordChange}
            />
          </div>
          <Accordion type="multiple" className="w-full">
            {renderCheckboxGroup("Industry", "industries", sampleIndustries, Briefcase)}
            {renderCheckboxGroup("Location", "locations", sampleLocations, MapPin)}
            {renderCheckboxGroup("Company", "companies", sampleCompanies, Building)}
            {renderCheckboxGroup("Profile Language", "profileLanguages", sampleLanguages, Languages)}
          </Accordion>
          <Button onClick={handleSearch} className="w-full mt-6 text-lg py-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Search className="mr-2 h-5 w-5 animate-spin" /> Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" /> Search Prospects
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="w-full md:w-2/3 lg:w-3/4">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Search Results</h2>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                <Card key={i} className="animate-pulse">
                    <CardHeader>
                        <div className="h-24 w-24 bg-muted rounded-full mx-auto mb-2"></div>
                        <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-full mt-1 mx-auto"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                    </CardContent>
                </Card>
            ))}
          </div>
        )}
        {!isLoading && searchResults.length === 0 && (
          <Card className="shadow-lg drop-shadow-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No prospects found. Try adjusting your filters or click "Search Prospects" to begin.
              </p>
            </CardContent>
          </Card>
        )}
        {!isLoading && searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(profile => (
              <Card key={profile.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 drop-shadow-md">
                <CardHeader className="items-center text-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden mb-3 border-2 border-primary">
                    <Image
                      src={profile.imageUrl || `https://picsum.photos/seed/${profile.id}/100/100`}
                      alt={profile.name}
                      data-ai-hint="profile picture"
                      fill
                      style={{objectFit: 'cover'}}
                    />
                  </div>
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{profile.headline}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center">
                    <MapPin className="h-3 w-3 mr-1 text-primary" /> {profile.location}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
                      View Profile
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
