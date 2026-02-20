export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-6 px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Susan Fashion. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
