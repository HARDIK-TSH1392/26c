export default function AdminAnalyticsPage() {
  const embedUrl = process.env.POSTHOG_SHARED_DASHBOARD_URL;

  if (!embedUrl) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        <div className="border border-line p-6 text-sm text-ink/70 max-w-lg">
          <p className="mb-3">
            No PostHog dashboard is linked yet. In PostHog: open a dashboard
            (or create one), click <strong>Share</strong>, toggle{" "}
            <strong>&ldquo;Share publicly&rdquo;</strong> on, and copy the
            share link.
          </p>
          <p>
            Set it as <code className="bg-line/50 px-1">
              POSTHOG_SHARED_DASHBOARD_URL
            </code>{" "}
            and redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="border border-line" style={{ height: "calc(100vh - 220px)" }}>
        <iframe
          src={embedUrl}
          title="PostHog Analytics"
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
