import "./globals.css";

export const metadata = {
  title: "EventBook - Find & Book Perfect Event Venues",
  description:
    "Discover and book the best marriage gardens, banquet halls, resorts, and event venues in Madhya Pradesh. Compare prices, check availability, and book instantly.",
  keywords:
    "event venues, marriage garden, banquet hall, wedding venue, booking platform, MP venues",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
