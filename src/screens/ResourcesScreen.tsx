import { useState } from 'react';
import { Book, Download, ShieldAlert, FileText, ChevronRight, X, CheckCircle2, Video, Play, Clock, ExternalLink } from 'lucide-react';

interface VideoTutorial {
  title: string;
  duration: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  moves: string[];
}

const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    title: "5 Self-Defense Moves Every Woman Should Know",
    duration: "6:42",
    description: "Learn how to use your body's strongest points to disable an attacker and escape safely.",
    youtubeId: "KVpxP3ZZtAc",
    thumbnailUrl: "https://img.youtube.com/vi/KVpxP3ZZtAc/hqdefault.jpg",
    moves: ["Heel palm strike to nose", "Knee strike to groin", "Base-of-palm wrist twist", "Eye gouge/swipe", "Active escape sprint"]
  },
  {
    title: "Self Defense Moves Every Woman Should Know",
    duration: "4:15",
    description: "Practical self-defense techniques demonstrated step by step for real-world scenarios.",
    youtubeId: "k9Jn0eP-ZVg",
    thumbnailUrl: "https://img.youtube.com/vi/k9Jn0eP-ZVg/hqdefault.jpg",
    moves: ["Identify thumb gap", "Rotate arm downward", "Pull against weak grip point", "Follow up with elbow strike"]
  },
  {
    title: "Simple Self Defense Moves You Should Know",
    duration: "5:30",
    description: "BuzzFeed's guide to simple, effective self-defense moves that anyone can learn quickly.",
    youtubeId: "M4_8PoRQP8w",
    thumbnailUrl: "https://img.youtube.com/vi/M4_8PoRQP8w/hqdefault.jpg",
    moves: ["Lower your center of gravity", "Tuck chin to protect airway", "Pluck hands and turn into attacker", "Strike and run"]
  },
  {
    title: "5 Self Defense Techniques Every Woman Should Know",
    duration: "5:12",
    description: "BeerBiceps Women's Fitness guide covering essential defense techniques for everyday safety.",
    youtubeId: "0UqK3tfuu8Q",
    thumbnailUrl: "https://img.youtube.com/vi/0UqK3tfuu8Q/hqdefault.jpg",
    moves: ["Hold keys between knuckles or hammer grip", "Strike with bezel of a tactical pen", "Swing a heavy purse to build distance", "Use phone corner as a target strike"]
  },
  {
    title: "7 Self-Defense Techniques for Women from Professionals",
    duration: "6:20",
    description: "Professional techniques from BRIGHT SIDE covering 7 critical self-defense scenarios.",
    youtubeId: "T7aNSRoDCmg",
    thumbnailUrl: "https://img.youtube.com/vi/T7aNSRoDCmg/hqdefault.jpg",
    moves: ["Create a defensive frame with forearms", "Bridge and roll to shift weights", "Shuck hips to create a space gap", "Kick away and stand up using tech-standup"]
  },
  {
    title: "The #1 Self-Defense Tip for Women",
    duration: "4:45",
    description: "Gracie Breakdown's most important self-defense principle that every woman must know.",
    youtubeId: "5g41-aK1LIY",
    thumbnailUrl: "https://img.youtube.com/vi/5g41-aK1LIY/hqdefault.jpg",
    moves: ["Practice the 360-degree scan", "Trust your instincts immediately", "Maintain safe distance from strangers", "Identify exits in every environment"]
  }
];

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
    title: "Essential Safety Gadgets & EDC",
    description: "Must-have everyday carry (EDC) items and gadgets to keep with you while traveling for personal protection.",
    type: "method",
    details: "Carrying the right safety gadgets can provide a crucial advantage in an emergency. These items should be easily accessible, legal to carry in your area, and you should be familiar with how to use them under pressure.",
    steps: [
      "Pepper Spray or Mace: Keep it on a keychain or in a readily accessible pocket, not buried in a bag. Practice using the safety lock.",
      "Personal Safety Alarm: A loud 130dB siren alarm can deter attackers and draw attention. Some have flashing strobe lights.",
      "Tactical Pen or Kubotan: A sturdy, legal self-defense tool that can be used to strike pressure points or break glass in an emergency.",
      "Portable Power Bank & Whistle: A dead phone is a major vulnerability. Always carry a power bank. A standard physical whistle is a reliable low-tech backup."
    ]
  },
  {
    title: "Situational Awareness & De-escalation",
    description: "Techniques to recognize environmental threats early and verbally defuse tense encounters.",
    type: "method",
    details: "Situational awareness is your primary line of defense. By staying alert and recognizing danger before it escalates, you can avoid conflicts entirely or de-escalate them through assertive communication.",
    steps: [
      "Practice the 360-Degree Scan: Periodically glance around your environment. Avoid walking while looking down at your phone or wearing headphones in both ears.",
      "Trust Your Instincts: If a situation, person, or place feels unsafe or makes you uncomfortable, leave immediately without worrying about seeming impolite.",
      "Set Clear Boundaries: Use a firm, clear, and loud voice to tell an encroaching individual to back off (e.g., 'Stop, stay back!'). This alerts bystanders.",
      "Maintain a Safe Stance: Stand with your feet shoulder-width apart, hands up in a defensive but non-confrontational posture, giving you balance and protection."
    ]
  },
  {
    title: "Basic Self-Defense Moves",
    description: "Critical, easy-to-remember physical defense techniques that everyone should know to escape an attacker.",
    type: "method",
    details: "The goal of self-defense is not to win a fight, but to create an opportunity to escape. Focus on vulnerable targets and use your body's strongest points.",
    steps: [
      "The Heel Palm Strike: Use the hard base of your palm to strike upward at the attacker's nose or chin. Keep your fingers curled back to avoid breaking them.",
      "Knee Strike: If grabbed from the front, drive your knee forcefully into the groin area. This is highly effective and requires little training.",
      "Wrist Release: If your wrist is grabbed, rotate your arm so you pull against the weakest point of their grip—the gap between their thumb and fingers.",
      "Elbow Strike: If attacked from behind or close range, a backward or sideways elbow strike to the face or ribs is extremely powerful."
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
    title: "Rideshare & Public Transit Safety",
    description: "A step-by-step protocol for staying safe while traveling alone using apps or transit.",
    type: "article",
    details: "Using rideshares or public transportation alone requires active vigilance. Following a pre-travel protocol significantly reduces safety risks and ensures someone always knows your status.",
    steps: [
      "Double-Verify Before Entering: Always match the vehicle license plate, make, model, and the driver's photo with the details shown in the app.",
      "Ask the Driver: 'Who are you picking up?' and wait for them to say your name, rather than asking 'Are you [Name]?'",
      "Share Your Live Trip Status: Use the app's native 'Share Trip Status' feature or send your live location to a trusted contact.",
      "Sit in the Back Seat: Sit on the passenger side (opposite the driver) to maintain maximum distance, visibility of the driver, and access to both doors."
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
  },
  {
    title: "EDC Protective Bag Checklist",
    description: "A comprehensive checklist of safety and protection items to pack in your handbag or backpack.",
    type: "artifact",
    details: "Your bag can function as a tool for personal security. Carrying these items and organizing them so they are accessible in under 2 seconds is key to physical defense.",
    steps: [
      "Pepper Gel (Over Spray): Gel shoots in a stream up to 12 feet and is less affected by wind blowback, making it safer to use in tight or outdoor spaces.",
      "Personal Alarm with Strobe: A 130dB+ pull-pin siren that emits a deafening noise and flashing light to disorient attackers and alert others.",
      "High-Lumen Tactical Flashlight: A compact flashlight (at least 300 lumens) with a bezel edge. The bright beam can temporarily blind an attacker at night.",
      "Physical Whistle: A pea-less, high-pitch safety whistle (such as Fox 40) that works without batteries and is extremely loud.",
      "Emergency Contact Card & Power Bank: Keep a backup portable charger and a laminated card with your blood type, ICE contacts, and medical alerts."
    ]
  }
];

export function ResourcesScreen() {
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

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
        {/* Self-Defense Video Tutorials */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-2">
            <Video className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-on-surface">Self-Defense Video Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VIDEO_TUTORIALS.map((video, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank');
                  setSelectedVideo(video);
                }}
                className="glass-panel overflow-hidden rounded-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-primary/10 shadow-sm flex flex-col bg-surface-container/20 group"
              >
                {/* Thumbnail container */}
                <div className="relative aspect-video w-full bg-black/10 overflow-hidden">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-[10px] text-white rounded font-medium flex items-center gap-1">
                    <Clock size={10} />
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">{video.title}</h3>
                    <p className="text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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

      {/* Video Detail Modal Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel max-w-xl w-full rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-on-surface bg-background shadow-2xl border border-primary/20">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface z-10 bg-surface-container/60"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mt-2 pr-8">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                <Video size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-primary leading-tight">{selectedVideo.title}</h2>
            </div>

            <a 
              href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-white/5 mt-1 relative group/play"
            >
              <img 
                src={`https://img.youtube.com/vi/${selectedVideo.youtubeId}/hqdefault.jpg`}
                alt={selectedVideo.title}
                className="w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/play:bg-black/20 transition-colors">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                <ExternalLink size={12} />
                Watch on YouTube
              </div>
            </a>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Key Steps to Practice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedVideo.moves.map((move, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs text-on-surface items-center p-2.5 rounded-lg bg-surface-container border border-white/5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="font-semibold text-on-surface flex-1 leading-snug">{move}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedVideo(null)}
              className="w-full h-11 bg-primary text-on-primary font-semibold rounded-xl transition-all hover:bg-primary/95 active:scale-[0.98] cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Finished Learning
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
