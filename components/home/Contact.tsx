"use client";

import { ButtonBody, MailIcon, SocialIcon, linkProps } from "@/components/ui";
import { form } from "@/lib/content";
import { contact, socials } from "@/lib/site";

/* Get in touch (#get-in-touch, the live anchor): its own section, separate from the footer (house rule). The live
   form's fields in the live order (Name, Email, Company, Message, Send) beside the address and email. This is a
   private demo, so the form does not submit anywhere: Send is caught and nothing leaves the page. */
export function Contact() {
  const mailto = `mailto:${contact.email}`;
  return <section className="section section-mist contact" id="get-in-touch" tabIndex={-1} aria-labelledby="contact-title" data-late>
    <span className="contact-waves" aria-hidden="true" />
    <div className="wrap contact-grid">
      <div className="contact-side">
        <h2 className="h2" id="contact-title" data-reveal="heading">{form.title}</h2>
        <address data-reveal="label">{contact.company},<br />{contact.address.map((l) => <span key={l}>{l}<br /></span>)}</address>
        <a href={mailto} className="contact-email u-link" data-reveal="label">{contact.email}</a>
        <ul className="socials" data-reveal="label">
          <li><a href={mailto} aria-label={`Email ${contact.email}`}><MailIcon /></a></li>
          {socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Eos Advisory on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}
        </ul>
      </div>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()} data-reveal="card" aria-label="Contact form">
        <div className="field-row">
          {form.fields.map((f) => <label key={f} className={`field${f === "Company" ? " field-wide" : ""}`}>
            <span>{f}</span>
            <input name={f.toLowerCase()} type={f === "Email" ? "email" : "text"} autoComplete={f === "Email" ? "email" : f === "Name" ? "name" : "organization"} />
          </label>)}
        </div>
        <label className="field"><span>{form.message}</span><textarea name="message" rows={3} /></label>
        <button type="submit" className="btn btn-ink"><ButtonBody>{form.send}</ButtonBody></button>
      </form>
    </div>
  </section>;
}
