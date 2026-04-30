import React, { useEffect, useMemo, useState } from "react";
import { Activity, Clock3, MapPinned, MessageCircle, UserRound } from "lucide-react";
import { subscribeToSupportSessions } from "@/lib/supportChatService";
import { subscribeToSlotStatuses } from "@/lib/slotStatusService";
import { buildVicinitySlots, getAllVicinityProperties } from "@/lib/vicinitySlots";
import { normalizeSlotStatus } from "@/lib/slotStatus";

/** @typedef {{ status?: string, liveAgentRequested?: boolean }} SupportSession */
/** @typedef {{ status?: string }} SlotOverride */
/** @typedef {Record<string, SlotOverride>} SlotStatusMap */

/**
 * @param {{
 * label: string;
 * value: number | string;
 * helper: string;
 * icon: React.ComponentType<{ className?: string }>;
 * tone?: "emerald" | "blue" | "amber" | "rose";
 * }} props
 */
function MetricCard(props) {
  const { label, value, helper, icon: Icon, tone = "emerald" } = props;
  const toneClass = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function SupportAdminOverview() {
  const [sessions, setSessions] = useState(/** @type {SupportSession[]} */ ([]));
  const [statusOverrides, setStatusOverrides] = useState(/** @type {SlotStatusMap} */ ({}));

  useEffect(() => {
    const unsubscribe = subscribeToSupportSessions(
      /** @param {SupportSession[]} nextSessions */
      (nextSessions) => {
        setSessions(Array.isArray(nextSessions) ? nextSessions : []);
      },
      /** @param {unknown} error */
      (error) => {
        console.error(error);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToSlotStatuses(
      /** @param {SlotStatusMap} nextStatuses */
      (nextStatuses) => {
        setStatusOverrides(nextStatuses && typeof nextStatuses === "object" ? nextStatuses : {});
      },
      /** @param {unknown} error */
      (error) => {
        console.error(error);
      },
    );

    return unsubscribe;
  }, []);

  const liveAgentRequestedCount = useMemo(
    () => sessions.filter((session) => session.liveAgentRequested).length,
    [sessions],
  );

  const activeSessionsCount = useMemo(
    () => sessions.filter((session) => session.status === "active" || session.status === "agent-connected").length,
    [sessions],
  );

  const waitingSessionsCount = useMemo(
    () => sessions.filter((session) => session.status === "waiting" || session.liveAgentRequested).length,
    [sessions],
  );

  const slotSummary = useMemo(() => {
    const allProperties = getAllVicinityProperties();
    const allSlots = buildVicinitySlots(allProperties);

    const summary = {
      total: allSlots.length,
      available: 0,
      reserved: 0,
      not_available: 0,
    };

    for (const slot of allSlots) {
      const override = statusOverrides[slot.slotId];
      const status = normalizeSlotStatus(override?.status ?? slot.defaultStatus);

      if (status === "available") {
        summary.available += 1;
      } else if (status === "reserved") {
        summary.reserved += 1;
      } else {
        summary.not_available += 1;
      }
    }

    return summary;
  }, [statusOverrides]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Live Requests"
          value={liveAgentRequestedCount}
          helper="Sessions requesting live support"
          icon={MessageCircle}
          tone="emerald"
        />
        <MetricCard
          label="Active Sessions"
          value={activeSessionsCount}
          helper="Conversations currently active"
          icon={Activity}
          tone="blue"
        />
        <MetricCard
          label="Waiting Queue"
          value={waitingSessionsCount}
          helper="Customers waiting for agent"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Total Sessions"
          value={sessions.length}
          helper="All support chats in stream"
          icon={UserRound}
          tone="rose"
        />
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-[#15803d]" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#15803d]">Vicinity Snapshot</p>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Current Slot Status Summary</h3>
        <p className="mt-1 text-sm text-slate-500">Support admins can view real-time slot status from the vicinity map without editing.</p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{slotSummary.total}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Available</p>
            <p className="mt-1 text-2xl font-black text-emerald-700">{slotSummary.available}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Reserved</p>
            <p className="mt-1 text-2xl font-black text-amber-700">{slotSummary.reserved}</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Sold</p>
            <p className="mt-1 text-2xl font-black text-rose-700">{slotSummary.not_available}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
