import { useState } from 'react';
import { Book, Download, ShieldAlert, FileText, ChevronRight, X, CheckCircle2 } from 'lucide-react';

interface ResourceData {
  title: string;
  description: string;
  type: 'method' | 'article' | 'artifact';
  details: string;
  steps: string[];
}

const RESOURCES_DATA: ResourceData[] = [
  {
    title: "Establish a Code Word",
    description: "Create a safe word with trusted friends to indicate you need immediate help without alerting an abuser.",
    type: "method",
    details: "A distress code word is a simple, pre-arranged phrase that you can use in text messages or telephone calls. It alerts your trusted contacts to contact emergency services or come to your aid immediately.",
    steps: [
      "Select a word or phrase that sounds natural in casual conversation (e.g., 'Did you check on the blue sweater?').",
      "Share it ONLY with people you trust implicitly. Do not write it down on shared devices.",
      "Agree on what the exact response should be (e.g., calling 112, or arriving at your location within 10 minutes).",
      "Practice using it occasionally so it remains fresh in your mind."
    ]
  },
  {
    title: "Safe Exit Plan",
    description: "Pack a discreet 'go-bag' with essentials (ID, cash, keys). Know all possible exits from your home.",
    type: "method",
    details: "A safety exit plan outlines a fast getaway strategy. Having essential items packed and knowing your path helps minimize hesitation during a critical escalation.",
    steps: [
      "Prepare a 'go-bag' containing spare keys, cash, copies of identification, and critical prescription medicine.",
      "Stash this bag in a hidden place (e.g., at a trusted friend's house, or hidden in a locker/closet).",
      "Identify all possible exits in your house: doors, low windows, and fire escapes.",
      "Map out safe destinations where you can go immediately (shelters, 24-hour public zones, or trusted neighbors)."
    ]
  },
  {
    title: "Digital Hygiene",
    description: "Clear browser history, use incognito mode, and never save passwords on shared devices.",
    type: "method",
    details: "Abusers often monitor phones and web history. Maintaining strong digital hygiene prevents them from discovering your search history, legal research, or escape plans.",
    steps: [
      "Always use private browsing (Incognito) when searching for safety resources or local shelters.",
      "Avoid saving passwords or autofill details on shared computers or tablets.",
      "Review your active location-sharing services in phone settings and disable public geotagging.",
      "Use messaging applications with disappearing messages (like Signal) for confidential support chats."
    ]
  },
  {
    title: "Understanding Your Legal Rights",
    description: "A comprehensive guide to protective orders, restraining orders, and legal recourse.",
    type: "article",
    details: "Understanding the legal system enables you to seek structural protection. Protective orders can legally forbid an abuser from contacting or approaching you.",
    steps: [
      "Research local filing procedures for restraining or temporary protective orders (TPOs).",
      "Keep digital and physical copies of police report reference numbers, hospital visits, and court summons.",
      "Connect with free legal aid organizations or victim advocacy groups who guide survivors through family courts.",
      "Know that breaking a protective order is a criminal offense—report any violation immediately to the police."
    ]
  },
  {
    title: "Recognizing Coercive Control",
    description: "Learn the subtle signs of emotional, digital, and financial abuse.",
    type: "article",
    details: "Abuse is not always physical. Coercive control is a pattern of behavior designed to make a person submissive, including monitoring, isolation, and financial restriction.",
    steps: [
      "Look for indicators of isolation: being pressured to stop seeing family, friends, or leaving your job.",
      "Identify financial control: having your spending tracked, cards withheld, or bank logins locked.",
      "Note digital stalking: demands for your location, passwords, or persistent threatening text messages.",
      "Consult professional counselors or local safety lines to talk through your experiences and validate them."
    ]
  },
  {
    title: "Incident Log Template",
    description: "A structured format to safely document events for legal evidence.",
    type: "artifact",
    details: "Documentation is powerful evidence in court and police proceedings. A chronological log of harassment, threats, or abuse builds a strong legal case.",
    steps: [
      "Record the date, exact time, description of what happened, and any witnesses present.",
      "Back up all evidence (photos, screenshots of messages, audio) to an encrypted cloud drive or a trusted friend's custody.",
      "Describe incidents objectively, sticking strictly to the facts of what occurred.",
      "Ensure this log is stored in a secure location that cannot be accessed by the abuser."
    ]
  },
  {
    title: "Safety Plan Checklist",
    description: "Ensure you have covered all critical safety preparations.",
    type: "artifact",
    details: "Use this checklist to audit your physical, digital, and communication safety setups to ensure there are no gaps in your safety grid.",
    steps: [
      "Confirm emergency contacts are updated in your speed dial and quick-actions menu.",
      "Ensure you have cash, duplicates of car/house keys, and copies of legal documentation secured.",
      "Instruct your neighbors or children on what to do if they hear disturbances or witness an emergency.",
      "Regularly review your plan with a support advocate as circumstances evolve."
    ]
  }
];

export function ResourcesScreen() {
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);

  const methods = RESOURCES_DATA.filter(r => r.type === 'method');
  const articles = RESOURCES_DATA.filter(r => r.type === 'article');
  const artifacts = RESOURCES_DATA.filter(r => r.type === 'artifact');

  return (
    <div className="flex-1 w-full max-w-screen-md mx-auto px-5 py-8 md:pt-24 z-10 relative">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Safety Resources</h1>
        <p className="text-sm text-on-surface-variant">Essential guides, methods, and templates for your security.</p>
      </div>

      <div className="space-y-8 pb-12">
        <ResourceSection title="Primary Safety Methods" icon={<ShieldAlert className="text-primary" size={20} />}>
          {methods.map((resource, idx) => (
            <ResourceCard 
              key={idx} 
              title={resource.title} 
              description={resource.description} 
              type={resource.type} 
              onClick={() => setSelectedResource(resource)}
            />
          ))}
        </ResourceSection>

        <ResourceSection title="Articles & Knowledge" icon={<Book className="text-primary" size={20} />}>
          {articles.map((resource, idx) => (
            <ResourceCard 
              key={idx} 
              title={resource.title} 
              description={resource.description} 
              type={resource.type} 
              onClick={() => setSelectedResource(resource)}
            />
          ))}
        </ResourceSection>

        <ResourceSection title="Artifacts & Templates" icon={<Download className="text-primary" size={20} />}>
          {artifacts.map((resource, idx) => (
            <ResourceCard 
              key={idx} 
              title={resource.title} 
              description={resource.description} 
              type={resource.type} 
              onClick={() => setSelectedResource(resource)}
            />
          ))}
        </ResourceSection>
      </div>

      {/* Detail Modal Overlay */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-on-surface bg-white shadow-2xl border border-primary/20">
            <button 
              onClick={() => setSelectedResource(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mt-2 pr-8">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                {selectedResource.type === 'method' && <ShieldAlert size={20} />}
                {selectedResource.type === 'article' && <FileText size={20} />}
                {selectedResource.type === 'artifact' && <Download size={20} />}
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#6750a4] leading-tight">{selectedResource.title}</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {selectedResource.details}
              </p>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Action Guidelines</h3>
                <div className="space-y-2">
                  {selectedResource.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-sm text-on-surface items-start">
                      <div className="w-5 h-5 rounded-full bg-[#eaddff] text-[#21005d] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedResource(null)}
              className="w-full h-11 bg-[#7d52b3] text-white font-semibold rounded-xl transition-all hover:bg-[#6750a4] active:scale-[0.98] cursor-pointer mt-4 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Got It, Thank You
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-2">
        {icon}
        <h2 className="text-lg font-bold text-on-surface">{title}</h2>
      </div>
      <div className="grid gap-3">
        {children}
      </div>
    </div>
  );
}

function ResourceCard({ title, description, type, onClick }: { title: string; description: string; type: 'method' | 'article' | 'artifact'; onClick: () => void }) {
  let Icon = ShieldAlert;
  if (type === 'article') Icon = FileText;
  if (type === 'artifact') Icon = Download;

  return (
    <div 
      onClick={onClick}
      className="glass-panel p-4 rounded-xl flex items-start gap-4 hover:bg-primary/5 transition-colors cursor-pointer group shadow-sm border border-primary/10"
    >
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-[#7d52b3] group-hover:text-white transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-on-surface group-hover:text-[#7d52b3] transition-colors">{title}</h3>
        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="self-center flex-shrink-0 text-on-surface-variant group-hover:text-[#7d52b3] transition-colors">
        <ChevronRight size={20} />
      </div>
    </div>
  );
}
