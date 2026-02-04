export default function About() {
  return (
    <section className="border p-5 rounded-lg">
      <h2 className="text-xl font-semibold mb-3 border-b border-neutral-400 pb-1">
        About
      </h2>

      <p className="text-lg leading-relaxed">
        I’m a{" "}
        <span className="font-semibold">Software Engineer</span>{" "}
        who enjoys designing reliable, scalable, and secure systems. I work
        across the stack using{" "}
        <span className="font-semibold">
          Node.js, Express.js, PostgreSQL
        </span>{" "}
        along with{" "}
        <span className="font-semibold">React and Next.js</span> to build clean,
        efficient, and user-focused applications.
      </p>

      <p className="text-lg leading-relaxed mt-4">
        I care deeply about system design, data flow, performance, and
        maintainability. I enjoy breaking down complex problems and building
        software that scales well in real-world applications.
      </p>
    </section>
  );
}
