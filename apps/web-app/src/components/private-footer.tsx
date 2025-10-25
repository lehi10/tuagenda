import packageJson from "../../package.json"

export function PrivateFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-4">
      <div className="container mx-auto px-6">
        <p className="text-right text-xs text-muted-foreground">
          tuagenda.pe © {currentYear} · v{packageJson.version}
        </p>
      </div>
    </footer>
  )
}
