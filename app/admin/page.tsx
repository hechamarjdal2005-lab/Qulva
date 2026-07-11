import { createClient } from "@/lib/supabase-server";
import { Newspaper, Users, Mail, FileText } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [articles, waitlist, contacts, sections] = await Promise.all([
    supabase.from("journal_articles").select("id", { count: "exact", head: true }),
    supabase.from("waitlist_entries").select("id", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
    supabase.from("page_sections").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Articles", count: articles.count || 0, icon: Newspaper, href: "/admin/articles" },
    { label: "Waitlist", count: waitlist.count || 0, icon: Users, href: "/admin/waitlist" },
    { label: "Contacts", count: contacts.count || 0, icon: Mail, href: "/admin/contacts" },
    { label: "Sections", count: sections.count || 0, icon: FileText, href: "/admin/content" },
  ];

  const { data: recentContacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentWaitlist } = await supabase
    .from("waitlist_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="animate-fade-in max-w-[1200px]">
      <div className="mb-12">
        <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
          Overview
        </p>
        <h1 className="text-display-lg text-black">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="bg-white border border-[#E5E5E5] p-6 hover:border-black transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-5 h-5 text-[#757575] group-hover:text-black transition-colors" />
                <span className="text-[32px] font-bold text-black font-mono leading-none">
                  {stat.count}
                </span>
              </div>
              <p className="text-label-sm uppercase tracking-widest text-[#757575] group-hover:text-black transition-colors">
                {stat.label}
              </p>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E5E5E5] p-6">
          <h3 className="text-label-sm uppercase tracking-widest text-black font-bold mb-6">
            Recent Contacts
          </h3>
          {recentContacts && recentContacts.length > 0 ? (
            <div className="space-y-4">
              {recentContacts.map((c) => (
                <div key={c.id} className="flex justify-between items-start pb-4 border-b border-[#E5E5E5] last:border-0">
                  <div>
                    <p className="text-body-md text-black font-semibold">{c.name}</p>
                    <p className="text-xs text-[#757575]">{c.email}</p>
                  </div>
                  <span className="text-xs text-[#757575] font-mono">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#757575]">No submissions yet.</p>
          )}
        </div>

        <div className="bg-white border border-[#E5E5E5] p-6">
          <h3 className="text-label-sm uppercase tracking-widest text-black font-bold mb-6">
            Recent Waitlist
          </h3>
          {recentWaitlist && recentWaitlist.length > 0 ? (
            <div className="space-y-4">
              {recentWaitlist.map((w) => (
                <div key={w.id} className="flex justify-between items-start pb-4 border-b border-[#E5E5E5] last:border-0">
                  <div>
                    <p className="text-body-md text-black font-semibold">{w.email}</p>
                    <p className="text-xs text-[#757575]">Score: {w.bio_score || "N/A"}%</p>
                  </div>
                  <span className="text-xs text-[#757575] font-mono">
                    #{w.queue_pos}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#757575]">No entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
