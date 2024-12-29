export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div>Public page.</div>
      <pre>
        Example name: {process.env.NEXT_PUBLIC_EXAMPLE_NAME}
        {"\n"}
        Example version: {process.env.NEXT_PUBLIC_EXAMPLE_VERSION}
        {"\n"}
        Next.js version: {process.env.NEXT_PUBLIC_NEXT_VERSION}
        {"\n"}
      </pre>
    </div>
  );
}
