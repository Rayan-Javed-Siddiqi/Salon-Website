"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{time: string, booked: boolean}[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoadingSlots(true);
      fetch(`/api/bookings?date=${selectedDate}&serviceId=${selectedService.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data.slots || []);
          setSelectedTime("");
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedService, selectedDate]);

  const handleBookService = (service: any) => {
    setSelectedService(service);
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedService || !selectedDate || !selectedTime) return;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
        }),
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 5000);
        setSelectedService(null);
        setSelectedDate("");
        setSelectedTime("");
        setName("");
        setPhone("");
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed due to an unexpected error.");
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden selection:bg-on-tertiary-container selection:text-white min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-tertiary/20">
        <div className="flex justify-between items-center px-6 md:px-20 lg:px-40 py-6 w-full max-w-[1440px] mx-auto">
          <div className="font-display-lg text-headline-lg tracking-tighter text-on-background">GLOBAL</div>
          <div className="hidden md:flex gap-10">
            <a className="text-primary font-bold border-b border-primary pb-1 font-label-caps text-label-caps hover-premium-glow hover-premium-text-glow" href="#">Heritage</a>
            <a className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary hover-premium-glow hover-premium-text-glow" href="#services">Services</a>
            <a className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary hover-premium-glow hover-premium-text-glow" href="#gallery">Lookbook</a>
            <a className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary hover-premium-glow hover-premium-text-glow" href="#contact">Contact</a>
          </div>
          <button 
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#D3432B] text-[#F9F7F2] font-label-caps text-label-caps px-8 py-3 hover-premium-glow hover-premium-box-glow"
          >
            Book Now
          </button>
        </div>
      </nav>

      <main>
        {/* Section 1: HERO */}
        <section className="relative h-screen w-full flex items-center px-6 md:px-20 lg:px-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="A master barber at work" className="w-full h-full object-cover brightness-[0.4]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANtEySCtCP_0Lnh3Hy_nm5Qx55txYtR2Gt2hXVxPgqoFPlMLCar4bpLczmDdMsK_wk5XOlXTfvcvaPFSH2efmaU04vymJwZ5C4MU-IQUWR5eYTegvdn0TIRD8jgfq3immhY5Ub-GmCbZCYLYVlAsEofZQnzkQWvnDUyAzV0MEZtkE-AWK5AVB3aZ8ucr3lZlJPoIXzFMCRFlec2bKaA6AZWX9l0fX2NuwB_7O_xOIuQZT6XH3ZE0lSDrISGxevygrvSYmt3JHNkOw" />
          </div>
          <div className="relative z-10 max-w-4xl">
            <h1 className="font-display-lg text-6xl md:text-[100px] leading-[1] text-on-surface text-shadow-sm mb-6 hover-premium-glow hover-premium-text-glow cursor-default">
              Sharp Cuts.<br />Clean Looks.<br />No Waiting.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md tracking-wide">
              Elevating the grooming narrative through precision craft and timeless tradition in the heart of Islamabad.
            </p>
            <div className="mt-12 flex items-center gap-6">
              <span className="w-12 h-[1px] bg-on-tertiary-container"></span>
              <span className="font-label-caps text-label-caps text-on-tertiary-container">ESTABLISHED 2024</span>
            </div>
          </div>
          <div className="hidden lg:flex absolute bottom-12 right-40 gap-4 items-center">
            <div className="text-right">
              <p className="font-label-caps text-[10px] text-tertiary-fixed-dim">SCROLL TO EXPLORE</p>
              <div className="w-full h-10 mt-2 flex justify-end">
                <div className="w-[1px] h-full bg-tertiary-fixed-dim/30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: THE LOOKBOOK */}
        <section id="gallery" className="py-20 md:py-32 px-6 md:px-20 lg:px-40 bg-surface-container-lowest">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
            <div className="col-span-1 lg:col-span-6">
              <span className="font-label-caps text-label-caps text-on-tertiary-container block mb-4">GALLERY NO. 01</span>
              <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-8">The Lookbook</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
                Authentic snapshots of our daily craft. Each session is an intentional study in texture, shape, and masculine refinement.
              </p>
            </div>
            <div className="hidden lg:flex col-span-6 justify-end items-center pb-4">
              <div className="flex items-center gap-2 text-on-tertiary-container">
                <span className="font-label-caps text-[10px]">CURRENT ARCHIVE</span>
                <span className="w-8 h-[1px] bg-on-tertiary-container/30"></span>
                <span className="font-label-caps text-[10px]">VOL. 24.1</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Column 1 */}
            <div className="flex flex-col gap-6 md:-mt-8">
              <div className="copper-etch p-1.5 aspect-[4/5] bg-surface-container overflow-hidden hover-premium-glow hover-premium-box-glow cursor-pointer">
                <img alt="Haircut Detail 1" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="/images/pic1.png" />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-label-caps text-[10px] text-on-tertiary-container">STUDY 01: MID FADE</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant opacity-50">ISB. 24</span>
              </div>
              
              <div className="copper-etch p-1.5 aspect-[4/5] bg-surface-container overflow-hidden mt-8 hover-premium-glow hover-premium-box-glow cursor-pointer">
                <img alt="Beard Detail" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="/images/pic2.png" />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-label-caps text-[10px] text-on-tertiary-container">STUDY 03: PROFILE</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant opacity-50">ISB. 24</span>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-6 md:mt-16">
              <div className="copper-etch p-1.5 aspect-[4/5] bg-surface-container overflow-hidden hover-premium-glow hover-premium-box-glow cursor-pointer">
                <img alt="Shop Atmosphere" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="/images/pic3.png" />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-label-caps text-[10px] text-on-tertiary-container">STUDY 02: THE STUDIO</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant opacity-50">ISB. 24</span>
              </div>
              
              <div className="copper-etch p-1.5 aspect-[4/5] bg-surface-container overflow-hidden mt-8 hover-premium-glow hover-premium-box-glow cursor-pointer">
                <img alt="Precision Cut" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="/images/Screenshot%202026-05-09%20021353.png" />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-label-caps text-[10px] text-on-tertiary-container">STUDY 04: TEXTURE</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant opacity-50">ISB. 24</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: SERVICES */}
        <section id="services" className="py-20 md:py-32 px-6 md:px-20 lg:px-40 bg-background relative overflow-hidden">
          <div className="hidden lg:block absolute right-0 top-0 text-[15vw] font-display-lg text-white/5 select-none leading-none -translate-y-1/4">CRAFT</div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 relative z-10">
            <div className="col-span-12">
              <span className="font-label-caps text-label-caps text-on-tertiary-container block mb-4 underline decoration-on-tertiary-container/30 underline-offset-8">THE MENU</span>
            </div>
          </div>
          
          <div className="space-y-0 relative z-10">
            {services.map((service) => (
              <div key={service.id} className="group py-12 border-b border-tertiary/20 flex flex-col md:flex-row justify-between items-start md:items-end hover:bg-surface-container-low transition-all duration-500 px-4">
                <div className="max-w-xl mb-4 md:mb-0">
                  <h3 className="font-headline-md text-3xl md:text-[48px] text-on-surface group-hover:translate-x-4 hover-premium-glow hover-premium-text-glow transition-transform duration-500">{service.serviceName}</h3>
                  <p className="font-body-md text-on-surface-variant mt-2 group-hover:translate-x-4 transition-transform duration-500 delay-75">
                    Premium styling tailored to your narrative.
                  </p>
                </div>
                <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container block mb-1">{service.durationMinutes} MIN</span>
                  <div className="flex items-center gap-6">
                    <span className="font-display-lg text-4xl md:text-headline-lg text-on-surface">Rs. {service.price}</span>
                    <button 
                      onClick={() => handleBookService(service)}
                      className="border border-on-tertiary-container text-on-tertiary-container px-6 py-2 font-label-caps text-[10px] hover-premium-glow hover-premium-box-glow hover:bg-on-tertiary-container hover:text-white"
                    >
                      BOOK
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: TESTIMONIALS */}
        <section className="py-20 md:py-32 px-6 md:px-20 lg:px-40 bg-background border-t border-tertiary/10">
          <div className="mb-20">
            <span className="font-label-caps text-label-caps text-on-tertiary-container block mb-4">TESTIMONIALS</span>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface">Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="font-body-lg text-xl md:text-[24px] leading-relaxed text-on-surface italic hover-premium-glow hover-premium-text-glow cursor-default">"The staff is very good specially their behaviour and safder bhai is very competent and do their work with dedication"</p>
              <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-on-tertiary-container"></span>
                <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">Qasim Masood</p>
              </div>
            </div>
            <div className="space-y-6 md:border-l md:border-tertiary/10 md:pl-12 mt-12 md:mt-0">
              <p className="font-body-lg text-xl md:text-[24px] leading-relaxed text-on-surface italic hover-premium-glow hover-premium-text-glow cursor-default">"I had an amazing experience with global's staff and there service as well. Hygienic and friendly environment awesome service!"</p>
              <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-on-tertiary-container"></span>
                <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">Sajjad Ullah</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: BOOKING ENGINE */}
        <section id="booking" className="py-20 md:py-32 px-6 md:px-20 lg:px-40 bg-surface-container-lowest relative">
          <div className="max-w-7xl mx-auto">
            {bookingSuccess ? (
              <div className="border border-on-tertiary-container p-12 text-center max-w-2xl mx-auto copper-etch bg-surface">
                <h3 className="font-display-lg text-4xl text-on-surface mb-4 hover-premium-glow hover-premium-text-glow">Booking Confirmed!</h3>
                <p className="font-body-md text-on-surface-variant">See you soon at GLOBAL Hair Saloon. We await your arrival.</p>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-6 hover-premium-glow hover-premium-text-glow cursor-default">Claim Your Slot</h2>
                  <p className="font-body-md text-on-surface-variant mb-12 lg:pr-10">
                    Select a time that suits your narrative. We prioritize quality over quantity, ensuring every slot is a dedicated experience.
                  </p>
                  
                  <div className="space-y-8 mb-12">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-tertiary-container block mb-2">SERVICE</label>
                      <select 
                        required
                        className="w-full bg-surface border border-tertiary/30 p-4 text-on-surface font-body-md outline-none focus:border-on-tertiary-container transition-colors appearance-none cursor-pointer"
                        value={selectedService?.id || ""}
                        onChange={(e) => {
                          const s = services.find(s => s.id === parseInt(e.target.value));
                          setSelectedService(s || null);
                        }}
                      >
                        <option value="" disabled>-- Select a Service --</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.serviceName} ({s.durationMinutes}m)</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="font-label-caps text-label-caps text-on-tertiary-container block mb-2">DATE</label>
                      <input 
                        type="date" 
                        required
                        disabled={!selectedService}
                        min={new Date().toISOString().split("T")[0]}
                        max={(() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          return d.toISOString().split("T")[0];
                        })()}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-surface border border-tertiary/30 p-4 text-on-surface font-body-md outline-none focus:border-on-tertiary-container transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-on-tertiary-container hover-premium-glow hover-premium-text-glow">
                      <span className="material-symbols-outlined">event</span>
                      <span className="font-label-caps text-label-caps">{selectedDate ? new Date(selectedDate).toDateString().toUpperCase() : "SELECT DATE"}</span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant hover-premium-glow hover-premium-text-glow">
                      <span className="material-symbols-outlined">location_on</span>
                      <span className="font-label-caps text-label-caps">I-8/4 ISLAMABAD</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {!selectedService || !selectedDate ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] border border-dashed border-tertiary/30 text-on-surface-variant font-label-caps">
                      CHOOSE SERVICE & DATE TO VIEW SLOTS
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] border border-tertiary/30 text-on-tertiary-container font-label-caps animate-pulse">
                      FINDING AVAILABILITY...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] border border-error/50 bg-error/10 text-error font-label-caps">
                      NO SLOTS AVAILABLE ON THIS DATE
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={slot.booked}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`copper-etch p-6 text-center transition-all group hover-premium-glow hover-premium-box-glow ${
                            selectedTime === slot.time ? "bg-on-tertiary-container" : slot.booked ? "bg-surface-container-high opacity-50 cursor-not-allowed" : "bg-primary-container hover:bg-on-tertiary-container/20"
                          }`}
                        >
                          <span className={`font-display-lg text-3xl block transition-colors ${selectedTime === slot.time ? "text-white" : slot.booked ? "text-on-surface-variant line-through" : "text-on-surface group-hover:text-tertiary"}`}>
                            {slot.time}
                          </span>
                          <span className={`font-label-caps text-[10px] ${selectedTime === slot.time ? "text-white/70" : "text-on-surface-variant"}`}>
                            {slot.booked ? "BOOKED" : selectedTime === slot.time ? "SELECTED" : "AVAILABLE"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedTime && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div>
                        <label className="font-label-caps text-label-caps text-on-tertiary-container block mb-2">YOUR NAME</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-surface border border-tertiary/30 p-4 text-on-surface font-body-md outline-none focus:border-on-tertiary-container transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-label-caps text-on-tertiary-container block mb-2">YOUR PHONE</label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 3XX XXXXXXX"
                          className="w-full bg-surface border border-tertiary/30 p-4 text-on-surface font-body-md outline-none focus:border-on-tertiary-container transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-12">
                    <button 
                      type="submit"
                      disabled={!selectedTime}
                      className="w-full bg-[#D3432B] text-[#F9F7F2] font-label-caps text-label-caps py-6 tracking-widest hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover-premium-glow hover-premium-box-glow"
                    >
                      {selectedTime ? `CONFIRM BOOKING FOR ${selectedTime}` : "SELECT A SLOT"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="w-full py-20 bg-surface-container-lowest border-t border-tertiary/10">
        <div className="grid grid-cols-1 md:grid-cols-12 px-6 md:px-20 lg:px-40 gap-8 items-start max-w-[1440px] mx-auto">
          <div className="md:col-span-4">
            <div className="font-display-lg text-headline-md text-on-surface mb-4 hover-premium-glow hover-premium-text-glow">GLOBAL</div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">The craft of grooming as a storied tradition. Serving the discerning gentleman since 2024.</p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-4 pt-4">
            <a className="text-on-surface-variant font-label-caps text-label-caps hover:text-tertiary transition-colors hover-premium-glow hover-premium-text-glow" href="#">Instagram</a>
            <a className="text-on-surface-variant font-label-caps text-label-caps hover:text-tertiary transition-colors hover-premium-glow hover-premium-text-glow" href="#">Privacy</a>
            <a className="text-on-surface-variant font-label-caps text-label-caps hover:text-tertiary transition-colors hover-premium-glow hover-premium-text-glow" href="#">Terms</a>
          </div>
          <div className="md:col-span-4 md:text-right pt-4">
            <p className="font-label-caps text-label-caps text-on-surface-variant hover-premium-glow hover-premium-text-glow">© 2024 GLOBAL HAIR SALOON. ISLAMABAD.</p>
            <div className="mt-8 flex md:justify-end gap-6 items-center">
              <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-10 h-10 border border-tertiary/20 flex items-center justify-center hover:border-tertiary transition-all cursor-pointer hover-premium-glow hover-premium-box-glow">
                <span className="material-symbols-outlined text-[18px]">north</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
