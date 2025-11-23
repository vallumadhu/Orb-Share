import { useState } from "react";

export default function About() {
    const faq = [
        {
            q: "What is Orb Share?",
            a: "Orb Share is a simple and secure platform where students can quickly share notes, PDFs, code files, or any text."
        },
        {
            q: "Why does Orb Share exist?",
            a: "In labs or libraries, students often need to log into WhatsApp Web or Gmail to share files or notes, which can be risky on public devices. Forgetting to log out could expose private data. Other platforms exist, but they usually require remembering IDs and give limited control over who can access your files. Orb Share solves this by letting you share text, PDFs, or code safely, track all your shared content when you log in, and control exactly who can view or edit your files. You can also share via QR code or link easily. "
        },
        {
            q: "What can I do with Orb Share?",
            a: (
                <ul>
                    <li>You can instantly share notes, PDFs, or code files with the people you choose.</li>
                    <li>Edit your files anytime from any device.</li>
                    <li>Decide exactly who can view your notes and who can make edits.</li>
                </ul>
            )
        },
        {
            q: "What's the core idea?",
            a: "Instead of chasing people for files or dealing with lost links, you simply create a note, choose who can access it, and maintain complete control. Everything stays organized and secure."
        }
    ];


    const [open, setOpen] = useState(null);

    return (
        <section className="about-faq">
            <div className="faq-list">
                {faq.map((item, i) => (
                    <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
                        <div
                            className="faq-question"
                            onClick={() => setOpen(open === i ? null : i)}
                        >
                            <h2>{item.q}</h2>
                            <span>{open === i ? "−" : "+"}</span>
                        </div>

                        {open === i && (
                            <div className="faq-answer">
                                <p>{item.a}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
