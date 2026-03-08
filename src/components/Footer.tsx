export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="border-t border-zinc-800 bg-background px-4 py-8 md:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-text-secondary">
          &copy; {currentYear} B.RALTON · Development &amp; Operations
        </p>

        {/* Social Links Placeholder - To be implemented in Epic 5 */}
        <div className="flex items-center gap-4">{/* Social link icons will go here */}</div>
      </div>
    </footer>
  )
}
