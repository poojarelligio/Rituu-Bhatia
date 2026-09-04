import Link from "next/link";
import Button from "@/components/ui/Button";
import IndexTab from "@/components/ui/IndexTab";
import ServiceCard from "@/components/ui/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import HeroCarousel from "@/components/site/HeroCarousel";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import HappyClients from "@/components/site/HappyClients";
import VaastuHero from "@/components/site/VaastuHero";
import HoroscopeSection from "@/components/site/HoroscopeSection";
import {
  getPublishedServices, getPublishedCourses, getFeaturedTestimonials,
  getSuccessStories, getUpcomingEvents, getMediaFeatures,
} from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, courses, testimonials, stories, events, mediaFeatures] = await Promise.all([
    getPublishedServices(),
    getPublishedCourses(),
    getFeaturedTestimonials(4),
    getSuccessStories(),
    getUpcomingEvents(3),
    getMediaFeatures(),
  ]);

  return (
    <>
      {/* Hero */}
      {/* Hero */}
      <HeroCarousel />

      {/* Services */}
      {/* Services Section - Portrait Cards */}
      <section className="bg-ivory py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading 
              eyebrow="THE PRACTICE" 
              title="Consultations for whatever's in front of you" 
              description="Each session is built around your actual question." 
            />
            <Button href="/services" variant="ghost" className="mb-12 sm:mb-2">View all services →</Button>
          </div>
          
          {/* Portrait Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tarot */}
            <Link href="/services/tarot-reading" className="service-portrait-card group">
              <div className="portrait-image-wrapper">
                <img 
                  src="/images/home/tarot-portrait.jpg" 
                  alt="Tarot Reading with Rituu Bhatia" 
                  className="portrait-image"
                />
                <div className="portrait-overlay">
                  <span className="portrait-badge">FREE</span>
                </div>
              </div>
              <div className="portrait-content">
                <div className="flex items-center gap-2 mb-2">
                  <span className="portrait-code">TR</span>
                  <span className="portrait-duration">45 min</span>
                </div>
                <h3 className="portrait-title">Tarot Reading</h3>
                <p className="portrait-description">Clarity on decisions, read card by card</p>
                <span className="portrait-cta">Book free session →</span>
              </div>
            </Link>

            {/* Vaastu */}
            <Link href="/services/vaastu" className="service-portrait-card group">
              <div className="portrait-image-wrapper">
                <img 
                  src="/images/home/vaastu-portrait.jpg" 
                  alt="Vaastu Consultation with Rituu Bhatia" 
                  className="portrait-image"
                />
                <div className="portrait-overlay">
                  <span className="portrait-badge">FREE</span>
                </div>
              </div>
              <div className="portrait-content">
                <div className="flex items-center gap-2 mb-2">
                  <span className="portrait-code">VA</span>
                  <span className="portrait-duration">60 min</span>
                </div>
                <h3 className="portrait-title">Vaastu Consultation</h3>
                <p className="portrait-description">Practical changes to how your space supports you</p>
                <span className="portrait-cta">Book free session →</span>
              </div>
            </Link>

            {/* Astrology */}
            <Link href="/services/astrology" className="service-portrait-card group">
              <div className="portrait-image-wrapper">
                <img 
                  src="/images/home/astrology-portrait.jpg" 
                  alt="Astrology Reading with Rituu Bhatia" 
                  className="portrait-image"
                />
                <div className="portrait-overlay">
                  <span className="portrait-badge">FREE</span>
                </div>
              </div>
              <div className="portrait-content">
                <div className="flex items-center gap-2 mb-2">
                  <span className="portrait-code">AS</span>
                  <span className="portrait-duration">60 min</span>
                </div>
                <h3 className="portrait-title">Astrology Reading</h3>
                <p className="portrait-description">Your chart read against your real questions</p>
                <span className="portrait-cta">Book free session →</span>
              </div>
            </Link>

            {/* Reiki */}
            <Link href="/services/reiki-healing" className="service-portrait-card group">
              <div className="portrait-image-wrapper">
                <img 
                  src="/images/home/reiki-portrait.jpg" 
                  alt="Reiki Healing with Rituu Bhatia" 
                  className="portrait-image"
                />
                <div className="portrait-overlay">
                  <span className="portrait-badge">FREE</span>
                </div>
              </div>
              <div className="portrait-content">
                <div className="flex items-center gap-2 mb-2">
                  <span className="portrait-code">RE</span>
                  <span className="portrait-duration">45 min</span>
                </div>
                <h3 className="portrait-title">Reiki Healing</h3>
                <p className="portrait-description">Hands-on energy session for stress & fatigue</p>
                <span className="portrait-cta">Book free session →</span>
              </div>
            </Link>
          </div>

          {/* Free badge - extra trust signal */}
          {/* <div className="text-center mt-12">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-burgundy bg-ivory-deep border border-gold/20 rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
              All sessions are 100% free — no payment needed
            </span>
          </div> */}
        </div>
      </section>

      {/* Success stories */}
      {stories.length > 0 && (
        <section className="bg-ivory-deep py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <SectionHeading eyebrow="CASE FILES" title="Real questions, real outcomes" description="A few of the situations clients brought to Rituu." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.slice(0, 3).map((story, i) => (
                <Link key={story.id} href={`/success-stories/${story.slug}`} className="group bg-ivory border border-line rounded-sm p-7 flex flex-col">
                  <IndexTab code="SS" index={i} className="self-start mb-5" />
                  <p className="font-display text-lg text-charcoal leading-snug mb-3">{story.summary}</p>
                  <span className="mt-auto text-xs text-burgundy group-hover:underline underline-offset-4">Read the full story →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Horoscope */}
      <HoroscopeSection />

      {/* Workshops */}
      {events.length > 0 && (
        <section className="bg-ivory py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="LEARN LIVE" title="Upcoming workshops & events" />
              <Button href="/workshops-events" variant="ghost" className="mb-12 sm:mb-2">View all events →</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="border border-line rounded-sm p-7 flex flex-col">
                  <p className="index-tab text-xs text-gold mb-4">{event.event_date}</p>
                  <p className="font-display text-lg text-charcoal mb-2">{event.title}</p>
                  <p className="text-sm text-charcoal/60 mb-6 flex-1">{event.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-charcoal/50 mb-4">
                    <span>{event.location}</span>
                    <span className="text-burgundy font-medium">{event.fee_display}</span>
                  </div>
                  <Button href="/workshops-events" variant="secondary">Register Now</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ... vasstu sections */}
      <VaastuHero />
      {/* ... other sections */}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialSlider 
          testimonials={testimonials}
          title="What our clients say"
          eyebrow="TESTIMONIALS"
          className="bg-ivory py-16"
        />
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <section className="relative py-24 overflow-hidden">
          {/* Parallax Background Image */}
          <div className="absolute inset-0">
            <div 
              className="w-full h-[120%] top-[-10%] relative bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: "url('images/bg/pageheader.jpg')",
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center 40%',
              }}
            />
            {/* Overlay - 40% opacity, leaving image 60% visible */}
            <div className="absolute inset-0 bg-ivory/10" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
              {/* Override SectionHeading colors with custom classes */}
              <div className="[&_h2]:text-ivory [&_p]:text-gold-soft/80">
                <SectionHeading 
                  eyebrow="LEARN THE PRACTICE" 
                  title="Certified courses, taught properly" 
                  description="For people who want to go beyond a single session."
                />
              </div>
              <Button href="/courses" variant="ghost" className="mb-12 sm:mb-2 text-ivory border-ivory/30 hover:bg-ivory/10">
                View all courses →
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.slice(0, 4).map((course, i) => (
                <Link 
                  key={course.id} 
                  href={`/courses/${course.slug}`} 
                  className="group flex items-start gap-5 border border-line rounded-sm p-7 hover:shadow-lg transition-shadow bg-ivory/80 backdrop-blur-sm hover:bg-ivory/95"
                >
                  <IndexTab code={course.code} index={i} />
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-charcoal/65 mb-3">{course.subtitle}</p>
                    <div className="flex items-center justify-between text-xs text-charcoal/50">
                      <span>{course.duration}</span>
                      <span className="text-burgundy font-medium">
                        {course.discount_price_display || course.price_display}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

       {/* ... videos sections */}
      <HappyClients />
      {/* ... other sections */}

      {/* Media features */}
      {mediaFeatures.length > 0 && (
        <section className="bg-charcoal text-ivory py-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <SectionHeading eyebrow="AS FEATURED IN" title="Media & Recognition" align="center" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {mediaFeatures.slice(0, 3).map((f) => (
                <a key={f.id} href={f.link || "#"} target="_blank" rel="noreferrer" className="border border-ivory/15 rounded-sm p-6 text-center hover:border-ivory/40 transition-colors">
                  <p className="index-tab text-[11px] text-gold-soft mb-3 uppercase">{f.feature_type}</p>
                  <p className="font-display text-base leading-snug mb-2">{f.title}</p>
                  <p className="text-xs text-ivory/50">{f.publication}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead magnet */}
      <section className="relative py-24 overflow-hidden border-y border-line">
          {/* Background Image - uses different approach for mobile */}
          <div 
            className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat md:bg-fixed"
            style={{ 
              backgroundImage: "url('/images/home/assessment-bg.jpg')",
            }}
          />
          
          {/* Overlay - slightly darker for readability */}
          <div className="absolute inset-0 bg-charcoal-soft/55 -z-10" />
          
          <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-10 text-center">
            <p className="index-tab text-xs text-gold-soft mb-5">FREE ASSESSMENT</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight mb-4">
              Discover what may be blocking your energy, prosperity & growth.
            </h2>
            <Button href="/assessment" variant="primary">Get Your Free Energy Assessment</Button>
          </div>
        </section>

      {/* Final CTA */}
      {/* <section className="bg-burgundy text-ivory py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-6">
            Ready to transform your life, space & energy?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/book" variant="onDark">Book a Consultation</Button>
          </div>
        </div>
      </section> */}
    </>
  );
}
