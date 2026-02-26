/**
 * CEEBO — FAQ-based knowledge map for marketing site
 * Deterministic keyword matching. No AI model.
 */

export interface KnowledgeEntry {
  keywords: string[]
  response: string
}

export const ceeboKnowledge: KnowledgeEntry[] = [
  {
    keywords: ["price", "cost", "how much", "pricing", "pay", "subscription"],
    response:
      "Constructify costs $19.99 per active user per month, plus an annual platform license based on company size: 1–25 users ($1,500/year), 26–100 users ($5,000/year), or 101+ users ($9,999/year). Visit our pricing page or contact sales for a custom quote.",
  },
  {
    keywords: ["schedule", "scheduling", "shifts", "roster"],
    response:
      "Constructify includes advanced scheduling with role-based assignments, shift planning, and real-time availability. You can assign workers to projects, track hours, and manage last-minute changes from desktop or mobile.",
  },
  {
    keywords: ["time tracking", "time track", "clock in", "clock out", "timesheet", "hours worked"],
    response:
      "Our time tracking lets workers clock in and out from their mobile device or kiosk. Managers can approve timesheets, track overtime, and integrate with payroll. All data syncs in real time across the platform.",
  },
  {
    keywords: ["training", "training hub", "certification", "courses", "learn"],
    response:
      "The Training Hub helps you manage certifications, OSHA training, and skill development. Track completion dates, send renewal alerts, and ensure your workforce stays compliant. Built-in content supports common construction certifications.",
  },
  {
    keywords: ["notification", "notifications", "alert", "remind", "reminder"],
    response:
      "Constructify sends smart notifications for certification expirations, schedule changes, safety incidents, and task assignments. Workers get alerts on their phone; admins see dashboards and email digests. You can customize what triggers alerts.",
  },
  {
    keywords: ["workforce", "workers", "employees", "team", "staff", "crew"],
    response:
      "Constructify’s workforce tools cover the full lifecycle: onboarding, profiles with 50+ fields, certifications, scheduling, time tracking, and payroll integration. Workers keep their unique Employee ID when moving between companies, so certifications and history follow them.",
  },
  {
    keywords: ["feature", "features", "what can", "capabilities", "does it do", "include"],
    response:
      "Constructify includes project management, scheduling, time tracking, safety compliance (OSHA), Training Hub, employee profiles, payroll integration, mobile apps, and reporting. All plans include cloud storage, real-time sync, and 24/7 support.",
  },
  {
    keywords: ["overview", "what is", "introduction", "tell me about", "explain constructify"],
    response:
      "Constructify is a construction management platform built for contractors and project teams. We combine project management, workforce management, safety compliance, and time tracking in one place so you can run jobs, track people, and stay compliant—all from a single system.",
  },
  {
    keywords: ["safety", "compliance", "osha", "incident", "drug test"],
    response:
      "Our safety module tracks OSHA compliance, certifications, drug testing, and incident reporting. You get automatic renewal alerts, compliance dashboards, and quick incident documentation with photos. Reduce risk and stay audit-ready.",
  },
  {
    keywords: ["project", "projects", "job", "job site"],
    response:
      "Constructify’s project management lets you track multiple jobs, assign workers, monitor progress, and manage budgets. Share documents, update status in real time, and coordinate across crews from one central place.",
  },
  {
    keywords: ["mobile", "app", "phone", "tablet"],
    response:
      "Constructify works on desktop and mobile with a responsive web app. Workers can clock in, view schedules, update profiles, and report incidents from their phone. No separate app store download—it’s ready in the browser.",
  },
  {
    keywords: ["integration", "integrate", "quickbooks", "payroll", "erp"],
    response:
      "Constructify supports integrations with QuickBooks, payroll systems, and other construction tools. Time and labor data can flow into your existing workflows. Contact sales to discuss your specific integration needs.",
  },
]

const DEFAULT_RESPONSE =
  "That's a great question. Our team would love to walk you through that."

/**
 * Match user input against FAQ knowledge.
 * Returns matching response or default.
 */
export function matchResponse(userInput: string): string {
  const lower = userInput.toLowerCase().trim()
  if (!lower) return DEFAULT_RESPONSE

  for (const entry of ceeboKnowledge) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response
    }
  }

  return DEFAULT_RESPONSE
}
