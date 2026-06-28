import { Book, Download, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export function ResourcesScreen() {
  return (
    <div className="flex-1 w-full max-w-screen-md mx-auto px-5 py-8 md:pt-24 z-10 relative">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Safety Resources</h1>
        <p className="text-sm text-on-surface-variant">Essential guides, methods, and artifacts for your security.</p>
      </div>

      <div className="space-y-8 pb-12">
        <ResourceSection title="Primary Safety Methods" icon={<ShieldAlert className="text-tertiary" size={20} />}>
          <ResourceCard title="Establish a Code Word" description="Create a safe word with trusted friends to indicate you need immediate help without alerting the abuser." type="method" />
          <ResourceCard title="Safe Exit Plan" description="Pack a discreet 'go-bag' with essentials (ID, cash, keys). Know all possible exits from your home." type="method" />
          <ResourceCard title="Digital Hygiene" description="Clear browser history, use incognito mode, and never save passwords on shared devices." type="method" />
        </ResourceSection>

        <ResourceSection title="Articles & Knowledge" icon={<Book className="text-primary" size={20} />}>
          <ResourceCard title="Understanding Your Legal Rights" description="A comprehensive guide to protective orders and legal recourse." type="article" />
          <ResourceCard title="Recognizing Coercive Control" description="Learn the subtle signs of emotional and financial abuse." type="article" />
        </ResourceSection>

        <ResourceSection title="Artifacts & Templates" icon={<Download className="text-secondary" size={20} />}>
          <ResourceCard title="Incident Log Template" description="A structured format to safely document events for legal evidence." type="artifact" />
          <ResourceCard title="Safety Plan Checklist" description="Downloadable PDF to ensure you have covered all critical steps." type="artifact" />
        </ResourceSection>
      </div>
    </div>
  );
}

function ResourceSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        {icon}
        <h2 className="text-lg font-bold text-on-surface">{title}</h2>
      </div>
      <div className="grid gap-3">
        {children}
      </div>
    </div>
  );
}

function ResourceCard({ title, description, type }: { title: string; description: string; type: 'method' | 'article' | 'artifact' }) {
  let Icon = ShieldAlert;
  if (type === 'article') Icon = FileText;
  if (type === 'artifact') Icon = Download;

  return (
    <div className="glass-panel p-4 rounded-xl flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer group shadow-sm border border-white/5">
      <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-on-surface-variant flex-shrink-0 group-hover:text-primary transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-on-surface">{title}</h3>
        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="self-center flex-shrink-0 text-on-surface-variant group-hover:text-primary transition-colors">
        <ChevronRight size={20} />
      </div>
    </div>
  );
}
