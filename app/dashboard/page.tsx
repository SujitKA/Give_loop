import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Package,
  Send,
  Trash2,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";

async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch user's donations
  const { data: myItems } = await supabase
    .from("items")
    .select(
      "*, requests:item_requests(requester_id, status, created_at, requester:profiles(full_name, city, phone))"
    )
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch user's requests
  const { data: myRequests } = await supabase
    .from("item_requests")
    .select(
      "*, item:items(*, donor:profiles(full_name, city, phone))"
    )
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false });

  return {
    user,
    myItems: (myItems || []) as any[],
    myRequests: (myRequests || []) as any[],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login?redirectTo=/dashboard");
  }

  const { user, myItems, myRequests } = data;

  const donorInitial =
    user.user_metadata?.full_name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your donations and track your requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/donate">
              <Button className="px-6 py-2.5 gap-2 flex items-center">
                <Package className="w-4 h-4" />
                Donate an Item
              </Button>
            </Link>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
              {donorInitial}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {user.user_metadata?.full_name || user.email?.split("@")[0] ||
                "Community Member"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Donations */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Donations
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Items you&apos;ve listed. Edit, delete, or mark them as given away.
              </p>

              {myItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You haven&apos;t donated anything yet.
                  </p>
                  <Link
                    href="/donate"
                    className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Create your first listing &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myItems.map((item: any) => {
                    const pendingCount = (item.requests || []).filter(
                      (r: any) => r.status === "Pending"
                    ).length;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                              {item.title}
                            </span>
                            <Badge
                              variant={
                                item.status === "Available"
                                  ? "success"
                                  : item.status === "Reserved"
                                  ? "warning"
                                  : "default"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{item.city}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{formatRelativeTime(item.created_at)}</span>
                          </div>
                          {pendingCount > 0 && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-100 dark:border-amber-900">
                              {pendingCount} pending request{pendingCount > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/items/${item.id}`}
                            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline px-3 py-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                          >
                            View
                          </Link>
                          {/* Note: Mark as Given and Delete functionality require Client Component wrapper or Server Actions */}
                          <div className="flex items-center gap-2 opacity-50 cursor-not-allowed" title="Actions available in full version">
                             <Trash2 className="w-3 h-3" />
                             <span className="text-[10px]">Manage</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* My Requests */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Requests
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Items you&apos;ve requested and their current status.
              </p>

              {myRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Send className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You haven&apos;t requested anything yet.
                  </p>
                  <Link
                    href="/"
                    className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Browse available items &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req: any) => {
                    const item = req.item;
                    const statusColor =
                      req.status === "Pending"
                        ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900"
                        : req.status === "Accepted"
                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900"
                        : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900";
                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                              Requested: {item?.title || "Unknown Item"}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{item?.city || "—"}</span>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColor}`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item && (
                            <Link
                              href={`/items/${item.id}`}
                              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline px-3 py-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                            >
                              View Item <ChevronRight className="w-3 h-3 ml-1" />
                            </Link>
                          )}
                        </div>
                        {req.status === "Accepted" && item?.donor && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                              {item.donor.full_name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                Donor contact revealed
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {item.donor.city}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Phone: {item.donor.phone || "Not provided"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
