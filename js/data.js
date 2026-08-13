// GM x GG Pipeline - Video Marketing Dataset (Spanish & English)
export const CAMPAIGN_DATA = {
  client: {
    name: "Grupo Médico & Odontológico",
    shortName: "Grupo Médico",
    doctor: "Dr. Mario Pinilla",
    location: "Barrio Colón, Calle 17 #8a-41, Montería, Colombia",
    whatsapp: "+57 300 000 0000",
    experience: "13+ años de trayectoria",
    logo: "grupomedico-logo-mini.png"
  },
  agency: {
    name: "GUNERY",
    type: "Creative Agency",
    role: "Video Marketing & Content Production",
    logo: "GUNERY Type Logo Black.png",
    mark: "G only.png"
  },
  campaign: {
    title: {
      es: "Campaña de Video Marketing — Grupo Médico & Odontológico",
      en: "Video Marketing Campaign — Grupo Médico & Odontológico"
    },
    subtitle: {
      es: "Cronograma de grabación, edición y publicación",
      en: "Shooting, editing and publishing schedule"
    },
    dateRange: "15 Ago – 20 Sep",
    totalVideos: 9,
    shootingDaysCount: 4,
    shootingDays: [
      { date: "2026-08-15", label: { es: "Vie 15 Ago", en: "Fri Aug 15" }, videos: [1] },
      { date: "2026-08-19", label: { es: "Mié 19 Ago", en: "Wed Aug 19" }, videos: [2, 3, 4] },
      { date: "2026-09-04", label: { es: "Vie 4 Sep", en: "Fri Sep 4" }, videos: [5, 6, 7] },
      { date: "2026-09-10", label: { es: "Jue 10 Sep", en: "Thu Sep 10" }, videos: [8, 9] }
    ],
    rules: {
      pacing: {
        es: "Cada video tiene mínimo 4 días de edición/postproducción. Las publicaciones se espacian cada 3 días aproximadamente.",
        en: "Every video gets a minimum 4-day editing/postproduction window. Publish dates are spaced roughly every 3 days."
      },
      hook: {
        es: 'Todos los guiones inician con: "Soy Dr. Mario Pinilla, tu médico amigo"',
        en: 'Every script opens with: "I\'m Dr. Mario Pinilla, your friendly doctor"'
      },
      maxDuration: "1:15 min"
    }
  },
  videos: [
    {
      id: 1,
      number: "01",
      topic: {
        es: "Presentación de Grupo Médico",
        en: "About Grupo Médico"
      },
      category: {
        es: "Institucional / Marca",
        en: "Brand & Overview"
      },
      categoryKey: "brand",
      shootDate: "2026-08-15",
      shootDateFormatted: { es: "Vie 15 Ago", en: "Fri Aug 15" },
      shootTime: "9:00 AM",
      publishDate: "2026-08-19",
      publishDateFormatted: { es: "Mié 19 Ago", en: "Wed Aug 19" },
      defaultStatus: "script_approved", // script_approved | shooting | editing | client_review | published
      duration: "1:15",
      location: {
        es: "Sede Clínica (Barrio Colón, Calle 17 #8a-41)",
        en: "Clinic HQ (Barrio Colón, Calle 17 #8a-41)"
      },
      notes: {
        es: "Dr. Mario camina y habla dentro de la clínica. Mostrar consultorios, equipos, fachada. Mencionar las dos modalidades (sede y domicilio). Overlay en pantalla: dirección + WhatsApp.",
        en: "Dr. Mario walks and talks inside the clinic. Show consultation rooms, equipment, exterior signage. Mention both modalities (clinic + home visits). On-screen overlay: address + WhatsApp."
      },
      overlays: [
        "Dirección: Barrio Colón, Calle 17 #8a-41",
        "WhatsApp de citas",
        "Logo Grupo Médico + Gunery"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y esta es tu clínica de confianza en Montería.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and this is your trusted clinic in Montería."
        },
        {
          time: "0:08–0:22",
          secondsStart: 8,
          secondsEnd: 22,
          es: "Somos Grupo Médico. Llevamos más de 13 años cuidando la salud de las familias de esta ciudad, con el mismo compromiso desde el primer día.",
          en: "We're Grupo Médico. We've spent over 13 years caring for families in this city, with the same commitment since day one."
        },
        {
          time: "0:22–0:40",
          secondsStart: 22,
          secondsEnd: 40,
          es: "Aquí puedes recibir atención de dos formas: en nuestra sede en el Barrio Colón, Calle 17 #8a-41, con consultorios equipados y atención ágil con cita previa...",
          en: "You can get care from us in two ways: at our clinic in Barrio Colón, Calle 17 #8a-41, with fully equipped consultation rooms and fast service by appointment..."
        },
        {
          time: "0:40–0:55",
          secondsStart: 40,
          secondsEnd: 55,
          es: "...o si lo prefieres, llevamos a nuestros médicos y equipos portátiles hasta tu casa u oficina. Sin traslados, sin salas de espera.",
          en: "...or, if you prefer, we bring our doctors and portable equipment straight to your home or office. No travel, no waiting rooms."
        },
        {
          time: "0:55–1:08",
          secondsStart: 55,
          secondsEnd: 68,
          es: "Medicina general, pediatría, dermatología, ginecología, cardiología y ecografías especializadas, todo en un solo lugar.",
          en: "General medicine, pediatrics, dermatology, gynecology, cardiology, and specialized ultrasounds — all in one place."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Agenda tu cita por WhatsApp, el enlace está aquí abajo. Te esperamos con las puertas abiertas.",
          en: "Book your appointment on WhatsApp, link below. We're waiting for you with open doors."
        }
      ]
    },
    {
      id: 2,
      number: "02",
      topic: {
        es: "Frutas colombianas y metabolismo",
        en: "Colombian fruits & metabolism"
      },
      category: {
        es: "Nutrición & Bienestar",
        en: "Nutrition & Wellness"
      },
      categoryKey: "nutrition",
      shootDate: "2026-08-19",
      shootDateFormatted: { es: "Mié 19 Ago", en: "Wed Aug 19" },
      shootTime: "1:00 PM",
      publishDate: "2026-08-23",
      publishDateFormatted: { es: "Dom 23 Ago", en: "Sun Aug 23" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Sede Clínica (Consultorio Médico con atrezzo frutas)",
        en: "Clinic HQ (Consultation Room with fruit props)"
      },
      notes: {
        es: "4 frutas colombianas + 1 bonus (kiwi). Disclaimer en pantalla: \"Consulta con tu médico si tienes alguna condición o alergia.\" Guardar la fruta bonus para el final.",
        en: "4 Colombian fruits + 1 bonus (kiwi). On-screen disclaimer: \"Consult your doctor if you have a health condition or allergy.\" Save the bonus fruit for the end."
      },
      overlays: [
        "Disclaimer: Consulta con tu médico si tienes alguna condición o alergia",
        "Texto dinámico: Guanábana, Papaya, Maracuyá, Piña + Kiwi Bonus",
        "CTA WhatsApp Medicina Interna"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy te traigo un tip que tu metabolismo te va a agradecer.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today I've got a tip your metabolism will thank you for."
        },
        {
          time: "0:08–0:20",
          secondsStart: 8,
          secondsEnd: 20,
          es: "Si no tienes esta fruta en tu casa ahora mismo, te estás perdiendo de mucho. Te cuento cuáles son.",
          en: "If you don't have this fruit at home right now, you're missing out. Let me tell you which ones."
        },
        {
          time: "0:20–0:45",
          secondsStart: 20,
          secondsEnd: 45,
          es: "Guanábana, papaya, maracuyá y piña. Estas cuatro frutas ayudan a tu digestión y a tu metabolismo de forma completamente natural, si no tienes ninguna condición de salud ni alergia a ellas.",
          en: "Soursop, papaya, passion fruit, and pineapple. These four fruits naturally support your digestion and metabolism, as long as you don't have a health condition or allergy to them."
        },
        {
          time: "0:45–0:55",
          secondsStart: 45,
          secondsEnd: 55,
          es: "Y espera, porque tengo una quinta fruta bonus que no es colombiana, pero también te va a sorprender... el kiwi.",
          en: "And wait, because I've got a bonus fifth fruit that's not Colombian, but it'll surprise you too... kiwi."
        },
        {
          time: "0:55–1:10",
          secondsStart: 55,
          secondsEnd: 70,
          es: "En Grupo Médico también contamos con medicina interna, por si quieres una asesoría nutricional personalizada.",
          en: "At Grupo Médico we also offer internal medicine, in case you want personalized nutrition guidance."
        },
        {
          time: "1:10–1:15",
          secondsStart: 70,
          secondsEnd: 75,
          es: "Agenda tu cita por WhatsApp y cuidemos tu salud juntos.",
          en: "Book your appointment on WhatsApp, and let's take care of your health together."
        }
      ]
    },
    {
      id: 3,
      number: "03",
      topic: {
        es: "Atención a Domicilio",
        en: "Home Visit Service"
      },
      category: {
        es: "Servicios Especiales",
        en: "Special Services"
      },
      categoryKey: "services",
      shootDate: "2026-08-19",
      shootDateFormatted: { es: "Mié 19 Ago", en: "Wed Aug 19" },
      shootTime: "1:30 PM",
      publishDate: "2026-08-26",
      publishDateFormatted: { es: "Mié 26 Ago", en: "Wed Aug 26" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Domicilio en Montería / Salida de la clínica con maletín",
        en: "Home in Montería / Clinic departure with medical kit"
      },
      notes: {
        es: "Mostrar maletín/equipo portátil, auto o traslado, llegada a una casa (recreada o real con consentimiento). Enfatizar comodidad y privacidad.",
        en: "Show portable equipment/bag, transport, arrival at a home (staged or real with consent). Emphasize comfort and privacy."
      },
      overlays: [
        "Atención a Domicilio en Montería",
        "Equipos Portátiles de Alta Tecnología",
        "Sin traslados • Sin esperas • Total privacidad"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy quiero contarte algo que muchos en Montería todavía no saben.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today I want to tell you something a lot of people in Montería still don't know."
        },
        {
          time: "0:08–0:22",
          secondsStart: 8,
          secondsEnd: 22,
          es: "No siempre tienes que salir de tu casa para recibir atención médica de calidad. En Grupo Médico llevamos la consulta hasta ti.",
          en: "You don't always have to leave your house to get quality medical care. At Grupo Médico, we bring the appointment to you."
        },
        {
          time: "0:22–0:40",
          secondsStart: 22,
          secondsEnd: 40,
          es: "Nuestros médicos especialistas van con equipos portátiles de alta tecnología directamente a tu hogar u oficina, en Montería.",
          en: "Our specialist doctors travel with high-tech portable equipment directly to your home or office, anywhere in Montería."
        },
        {
          time: "0:40–0:55",
          secondsStart: 40,
          secondsEnd: 55,
          es: "Nada de traslados, nada de salas de espera. La misma calidad y el mismo rigor profesional, en la comodidad y privacidad de tu propio espacio.",
          en: "No travel, no waiting rooms. The same quality and the same professional rigor, in the comfort and privacy of your own space."
        },
        {
          time: "0:55–1:08",
          secondsStart: 55,
          secondsEnd: 68,
          es: "Ideal para adultos mayores, personas con movilidad reducida, o simplemente si prefieres la tranquilidad de tu casa.",
          en: "Ideal for older adults, people with limited mobility, or simply if you prefer the peace of mind of your own home."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Escríbenos por WhatsApp y coordinamos tu visita a domicilio hoy mismo.",
          en: "Message us on WhatsApp and we'll set up your home visit today."
        }
      ]
    },
    {
      id: 4,
      number: "04",
      topic: {
        es: "Mito vs. Realidad: Automedicación",
        en: "Myth vs. Fact: Self-medication"
      },
      category: {
        es: "Educación & Prevención",
        en: "Education & Prevention"
      },
      categoryKey: "education",
      shootDate: "2026-08-19",
      shootDateFormatted: { es: "Mié 19 Ago", en: "Wed Aug 19" },
      shootTime: "2:00 PM",
      publishDate: "2026-08-29",
      publishDateFormatted: { es: "Sáb 29 Ago", en: "Sat Aug 29" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Sede Clínica (Consultorio)",
        en: "Clinic HQ (Consultation Room)"
      },
      notes: {
        es: "Formato dinámico \"mito / realidad\" — se puede grabar con transiciones o texto en pantalla marcando cada mito. Tono cercano, no alarmista.",
        en: "Dynamic \"myth / fact\" format — can be shot with transitions or on-screen text marking each myth. Approachable tone, not alarmist."
      },
      overlays: [
        "MITO: 'Lo que le sirvió a mi vecino me sirve a mí'",
        "REALIDAD: Cada cuerpo es diferente",
        "Tu salud no es un experimento"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy vamos a aclarar un mito que escucho todos los días en consulta.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today let's clear up a myth I hear in the office every single day."
        },
        {
          time: "0:08–0:20",
          secondsStart: 8,
          secondsEnd: 20,
          es: "Mito: \"si me automedico con lo que le sirvió a mi vecino, a mí también me va a servir.\"",
          en: "Myth: \"If it worked for my neighbor, it'll work for me too.\""
        },
        {
          time: "0:20–0:38",
          secondsStart: 20,
          secondsEnd: 38,
          es: "Realidad: cada cuerpo es diferente. Lo que funciona para una persona puede no funcionar para ti, o incluso hacerte daño, según tu historial y otros medicamentos que tomes.",
          en: "Fact: every body is different. What works for one person might not work for you — or could even harm you, depending on your medical history and other medications you take."
        },
        {
          time: "0:38–0:55",
          secondsStart: 38,
          secondsEnd: 55,
          es: "Automedicarse puede enmascarar síntomas importantes y retrasar un diagnóstico a tiempo.",
          en: "Self-medicating can mask important symptoms and delay a timely diagnosis."
        },
        {
          time: "0:55–1:08",
          secondsStart: 55,
          secondsEnd: 68,
          es: "En Grupo Médico contamos con medicina general y especialistas listos para darte un diagnóstico certero, en sede o en tu casa.",
          en: "At Grupo Médico we have general medicine and specialists ready to give you an accurate diagnosis, at our clinic or at your home."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Antes de automedicarte, escríbenos por WhatsApp. Tu salud no es un experimento.",
          en: "Before you self-medicate, message us on WhatsApp. Your health isn't an experiment."
        }
      ]
    },
    {
      id: 5,
      number: "05",
      topic: {
        es: "Pediatría — control de niño sano",
        en: "Pediatrics — well-child check-ups"
      },
      category: {
        es: "Pediatría & Familia",
        en: "Pediatrics & Family"
      },
      categoryKey: "pediatrics",
      shootDate: "2026-09-04",
      shootDateFormatted: { es: "Vie 4 Sep", en: "Fri Sep 4" },
      shootTime: "9:00 AM",
      publishDate: "2026-09-08",
      publishDateFormatted: { es: "Mar 8 Sep", en: "Tue Sep 8" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Consultorio Pediátrico con juguetes / decoración infantil",
        en: "Pediatric room with toys & kid-friendly decor"
      },
      notes: {
        es: "Consultorio pediátrico, si es posible con juguetes/decoración infantil visible. Tono cálido, dirigido a padres.",
        en: "Pediatric consultation room, ideally with visible kid-friendly decor/toys. Warm tone, directed at parents."
      },
      overlays: [
        "Control de Niño Sano: Crecimiento, Desarrollo y Vacunación",
        "Pediatría en Sede y a Domicilio",
        "Cuidamos de tu familia desde el primer día"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy quiero hablarles a los papás que nos ven.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today I want to speak to the parents watching."
        },
        {
          time: "0:08–0:22",
          secondsStart: 8,
          secondsEnd: 22,
          es: "El control de niño sano no es solo para cuando tu hijo está enfermo. Es clave para revisar su crecimiento, desarrollo y vacunación a tiempo.",
          en: "A well-child check-up isn't just for when your kid is sick. It's key for tracking growth, development, and vaccinations on schedule."
        },
        {
          time: "0:22–0:40",
          secondsStart: 22,
          secondsEnd: 40,
          es: "Muchos padres esperan a que aparezca un síntoma, pero la prevención es la mejor herramienta que tenemos para cuidar a los más pequeños.",
          en: "Many parents wait for a symptom to show up, but prevention is the best tool we have to take care of little ones."
        },
        {
          time: "0:40–0:55",
          secondsStart: 40,
          secondsEnd: 55,
          es: "En Grupo Médico contamos con pediatría en sede y también a domicilio, para que tu hijo se sienta cómodo y tranquilo durante la consulta.",
          en: "At Grupo Médico we offer pediatrics both at our clinic and at home, so your child feels comfortable and calm during the visit."
        },
        {
          time: "0:55–1:08",
          secondsStart: 55,
          secondsEnd: 68,
          es: "Si tu hijo lleva tiempo sin un control, este es el momento de agendarlo.",
          en: "If it's been a while since your child's last check-up, now's the time to book it."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Escríbenos por WhatsApp y cuidamos de tu familia, desde el primer día.",
          en: "Message us on WhatsApp — we take care of your family, from day one."
        }
      ]
    },
    {
      id: 6,
      number: "06",
      topic: {
        es: "Cardiología — cuándo hacerte un EKG",
        en: "Cardiology — when to get an EKG"
      },
      category: {
        es: "Cardiología & Diagnóstico",
        en: "Cardiology & Diagnostics"
      },
      categoryKey: "cardiology",
      shootDate: "2026-09-04",
      shootDateFormatted: { es: "Vie 4 Sep", en: "Fri Sep 4" },
      shootTime: "9:30 AM",
      publishDate: "2026-09-11",
      publishDateFormatted: { es: "Vie 11 Sep", en: "Fri Sep 11" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Consultorio de Cardiología / Área de Diagnóstico",
        en: "Cardiology room / Diagnostic suite"
      },
      notes: {
        es: "Mostrar equipo de electrocardiograma, consultorio de cardiología. Tono informativo, directo.",
        en: "Show EKG equipment, cardiology consultation room. Informative, direct tone."
      },
      overlays: [
        "¿Cuándo hacerte un EKG? Factores de riesgo +40 años",
        "Servicios: Ecocardiograma • EKG • MAPA • Holter",
        "En Sede o a Domicilio"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy hablemos de tu corazón.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today let's talk about your heart."
        },
        {
          time: "0:08–0:22",
          secondsStart: 8,
          secondsEnd: 22,
          es: "¿Sabes cuándo deberías hacerte un electrocardiograma? No es solo si sientes dolor en el pecho.",
          en: "Do you know when you should get an EKG? It's not just when you feel chest pain."
        },
        {
          time: "0:22–0:42",
          secondsStart: 22,
          secondsEnd: 42,
          es: "Si tienes antecedentes familiares de problemas cardíacos, si fumas, si tienes presión alta o simplemente pasas de los 40 años, un EKG a tiempo puede darte tranquilidad o detectar algo antes de que sea grave.",
          en: "If you have a family history of heart problems, if you smoke, if you have high blood pressure, or you're simply over 40, an EKG done early can give you peace of mind — or catch something before it becomes serious."
        },
        {
          time: "0:42–0:58",
          secondsStart: 42,
          secondsEnd: 58,
          es: "En Grupo Médico contamos con diagnóstico cardiovascular completo: ecocardiograma, EKG, MAPA y Holter, en sede o en tu casa.",
          en: "At Grupo Médico we offer complete cardiovascular diagnostics: echocardiogram, EKG, MAPA, and Holter — at our clinic or at your home."
        },
        {
          time: "0:58–1:08",
          secondsStart: 58,
          secondsEnd: 68,
          es: "No esperes a que tu cuerpo te avise con una alarma. La prevención empieza hoy.",
          en: "Don't wait for your body to sound the alarm. Prevention starts today."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Agenda tu cita por WhatsApp y cuidemos tu corazón juntos.",
          en: "Book your appointment on WhatsApp, and let's take care of your heart together."
        }
      ]
    },
    {
      id: 7,
      number: "07",
      topic: {
        es: "Ecografías — por qué son importantes",
        en: "Ultrasounds — why they matter"
      },
      category: {
        es: "Diagnóstico por Imágenes",
        en: "Ultrasound & Imaging"
      },
      categoryKey: "ultrasound",
      shootDate: "2026-09-04",
      shootDateFormatted: { es: "Vie 4 Sep", en: "Fri Sep 4" },
      shootTime: "10:00 AM",
      publishDate: "2026-09-14",
      publishDateFormatted: { es: "Lun 14 Sep", en: "Mon Sep 14" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Sala de Ecografía / Diagnóstico por Imagen",
        en: "Ultrasound Suite / Imaging Room"
      },
      notes: {
        es: "Mostrar equipo de ecografía, sala de diagnóstico por imagen. Mencionar variedad de estudios disponibles.",
        en: "Show ultrasound equipment, imaging diagnostics room. Mention the range of studies available."
      },
      overlays: [
        "+25 Estudios Especializados: Abdominal, Pediátrica, Gineco-obstétrica, Doppler",
        "Tecnología de Alta Resolución",
        "En Sede o en tu Hogar"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy quiero hablarte de una herramienta que salva vidas.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today I want to tell you about a tool that saves lives."
        },
        {
          time: "0:08–0:22",
          secondsStart: 8,
          secondsEnd: 22,
          es: "La ecografía nos permite ver lo que está pasando dentro de tu cuerpo, sin cirugía y sin radiación.",
          en: "An ultrasound lets us see what's happening inside your body — no surgery, no radiation."
        },
        {
          time: "0:22–0:40",
          secondsStart: 22,
          secondsEnd: 40,
          es: "En Grupo Médico contamos con más de 25 estudios especializados: ecografía abdominal, pediátrica, gineco-obstétrica, doppler vascular y muchos más.",
          en: "At Grupo Médico we offer more than 25 specialized studies: abdominal, pediatric, gynecological-obstetric ultrasounds, vascular doppler, and many more."
        },
        {
          time: "0:40–0:55",
          secondsStart: 40,
          secondsEnd: 55,
          es: "Con equipos de última generación, obtenemos imágenes de alta resolución para un diagnóstico preciso, ya sea en nuestra sede o en la comodidad de tu hogar.",
          en: "With state-of-the-art equipment, we get high-resolution images for an accurate diagnosis — whether at our clinic or in the comfort of your home."
        },
        {
          time: "0:55–1:08",
          secondsStart: 55,
          secondsEnd: 68,
          es: "Si tu médico te ha pedido una ecografía, o simplemente quieres un chequeo, estamos listos para atenderte.",
          en: "If your doctor has ordered an ultrasound, or you simply want a check-up, we're ready to help."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Escríbenos por WhatsApp y agenda tu estudio hoy mismo.",
          en: "Message us on WhatsApp and book your study today."
        }
      ]
    },
    {
      id: 8,
      number: "08",
      topic: {
        es: "Cómo agendar tu cita por WhatsApp",
        en: "How to book via WhatsApp"
      },
      category: {
        es: "Tutorial / Experiencia Paciente",
        en: "Tutorial / Patient Experience"
      },
      categoryKey: "tutorial",
      shootDate: "2026-09-10",
      shootDateFormatted: { es: "Jue 10 Sep", en: "Thu Sep 10" },
      shootTime: "1:00 PM",
      publishDate: "2026-09-17",
      publishDateFormatted: { es: "Jue 17 Sep", en: "Thu Sep 17" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Recepción Clínica / Pantalla de WhatsApp en mano",
        en: "Clinic Reception / Phone screen in hand"
      },
      notes: {
        es: "Grabar pantalla del celular mostrando el proceso real de WhatsApp mientras Dr. Mario narra en voz en off, o Dr. Mario sosteniendo el celular en cámara.",
        en: "Screen-record the phone showing the actual WhatsApp process while Dr. Mario narrates in voiceover, or Dr. Mario holding the phone on camera."
      },
      overlays: [
        "Paso a Paso: 1. Escribe 2. Elige Sede o Domicilio 3. Confirma",
        "Sin llamadas • Sin filas • En menos de 2 minutos"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy te muestro lo fácil que es agendar tu cita con nosotros.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today I'll show you how easy it is to book an appointment with us."
        },
        {
          time: "0:08–0:22",
          secondsStart: 8,
          secondsEnd: 22,
          es: "Solo tienes que escribirnos por WhatsApp al número que aparece en pantalla, o hacer clic en el enlace de nuestra página web.",
          en: "Just message us on WhatsApp at the number on screen, or click the link on our website."
        },
        {
          time: "0:22–0:38",
          secondsStart: 22,
          secondsEnd: 38,
          es: "Nos cuentas si prefieres atención en nuestra sede o a domicilio, qué servicio necesitas, y tu fecha y horario preferido.",
          en: "Tell us whether you'd prefer care at our clinic or at home, which service you need, and your preferred date and time."
        },
        {
          time: "0:38–0:52",
          secondsStart: 38,
          secondsEnd: 52,
          es: "Nosotros te confirmamos la cita directamente por chat, sin llamadas, sin filas, sin complicaciones.",
          en: "We'll confirm your appointment right there in the chat — no calls, no lines, no hassle."
        },
        {
          time: "0:52–1:05",
          secondsStart: 52,
          secondsEnd: 65,
          es: "Así de simple es cuidar tu salud con Grupo Médico.",
          en: "That's how simple it is to take care of your health with Grupo Médico."
        },
        {
          time: "1:05–1:15",
          secondsStart: 65,
          secondsEnd: 75,
          es: "Escríbenos ahora mismo y agenda tu cita en menos de dos minutos.",
          en: "Message us right now and book your appointment in under two minutes."
        }
      ]
    },
    {
      id: 9,
      number: "09",
      topic: {
        es: "Por qué confiar en nosotros (13+ años)",
        en: "Why trust us (13+ years)"
      },
      category: {
        es: "Cierre de Campaña / Autoridad",
        en: "Campaign Climax & Trust"
      },
      categoryKey: "trust",
      shootDate: "2026-09-10",
      shootDateFormatted: { es: "Jue 10 Sep", en: "Thu Sep 10" },
      shootTime: "1:30 PM",
      publishDate: "2026-09-20",
      publishDateFormatted: { es: "Dom 20 Sep", en: "Sun Sep 20" },
      defaultStatus: "script_approved",
      duration: "1:15",
      location: {
        es: "Instalaciones de Grupo Médico & Equipo Humano",
        en: "Grupo Médico Facilities & Medical Team"
      },
      notes: {
        es: "Tono más emotivo/institucional. Mostrar historia, equipo médico, instalaciones. Buen video de cierre de ciclo para reforzar marca.",
        en: "More emotional/institutional tone. Show history, medical team, facilities. Strong closing video to reinforce the brand at the end of this cycle."
      },
      overlays: [
        "13+ Años Cuidando la Salud en Montería",
        "Rigor Profesional y Calidez Humana",
        "Tu Salud, Nuestro Compromiso"
      ],
      script: [
        {
          time: "0:00–0:08",
          secondsStart: 0,
          secondsEnd: 8,
          es: "Soy Dr. Mario Pinilla, tu médico amigo, y hoy quiero contarte por qué tantas familias en Montería confían en nosotros.",
          en: "I'm Dr. Mario Pinilla, your friendly doctor, and today I want to tell you why so many families in Montería trust us."
        },
        {
          time: "0:08–0:25",
          secondsStart: 8,
          secondsEnd: 25,
          es: "Llevamos más de 13 años en esta ciudad, atendiendo a pacientes con el mismo compromiso del primer día: rigor profesional y calidez humana.",
          en: "We've been in this city for over 13 years, caring for patients with the same commitment since day one: professional rigor and human warmth."
        },
        {
          time: "0:25–0:42",
          secondsStart: 25,
          secondsEnd: 42,
          es: "No somos solo un centro médico. Somos médicos y especialistas certificados, con tecnología de avanzada, que te atendemos donde tú prefieras.",
          en: "We're not just a medical center. We're certified doctors and specialists, with advanced technology, who see you wherever you prefer."
        },
        {
          time: "0:42–0:58",
          secondsStart: 42,
          secondsEnd: 58,
          es: "En sede, con consultorios equipados y atención ágil. O en tu casa, con equipos portátiles de última generación.",
          en: "At our clinic, with fully equipped consultation rooms and fast service. Or at your home, with state-of-the-art portable equipment."
        },
        {
          time: "0:58–1:08",
          secondsStart: 58,
          secondsEnd: 68,
          es: "Tu salud y la de tu familia merece ese nivel de cuidado.",
          en: "Your health and your family's health deserve that level of care."
        },
        {
          time: "1:08–1:15",
          secondsStart: 68,
          secondsEnd: 75,
          es: "Escríbenos por WhatsApp. Grupo Médico, tu salud, nuestro compromiso.",
          en: "Message us on WhatsApp. Grupo Médico — your health, our commitment."
        }
      ]
    }
  ],
  pipelineStages: [
    {
      key: "script_approved",
      title: { es: "Guion Aprobado", en: "Script Approved" },
      shortTitle: { es: "Guion", en: "Script" },
      color: "blue",
      badgeClass: "badge-blue",
      description: { es: "Guion validado y listo para rodaje", en: "Script approved, ready for shoot" }
    },
    {
      key: "shooting",
      title: { es: "En Grabación", en: "Shooting" },
      shortTitle: { es: "Grabación", en: "Shooting" },
      color: "amber",
      badgeClass: "badge-amber",
      description: { es: "Producción y rodaje en curso", en: "On-set filming in progress" }
    },
    {
      key: "editing",
      title: { es: "En Edición (Post)", en: "Editing (Post)" },
      shortTitle: { es: "Edición", en: "Editing" },
      color: "purple",
      badgeClass: "badge-purple",
      description: { es: "Edición de video, audio y overlays (4 días)", en: "Video, audio & overlays (4 days)" }
    },
    {
      key: "published",
      title: { es: "Publicado / Listo", en: "Published / Ready" },
      shortTitle: { es: "Publicado", en: "Published" },
      color: "emerald",
      badgeClass: "badge-emerald",
      description: { es: "Publicado en Instagram / WhatsApp / Reels", en: "Live on Instagram, Reels, WhatsApp" }
    }
  ],
  initialComments: [
    {
      id: "c-1",
      videoId: 1,
      authorRole: "client",
      authorName: "Dr. Mario Pinilla (Grupo Médico)",
      timestamp: "2026-08-13T10:15:00Z",
      text: "Me gusta el enfoque inicial. Para la toma en consultorio, asegurémonos de que se vea el logo en el fondo de la pared.",
      timecode: "0:22",
      resolved: true,
      replies: [
        {
          id: "r-1-1",
          authorRole: "agency",
          authorName: "Gunery Creative Team",
          timestamp: "2026-08-13T11:00:00Z",
          text: "¡Excelente Dr. Mario! Llevamos lente angular y luz clave para destacar el logo institucional en el plano."
        }
      ]
    },
    {
      id: "c-2",
      videoId: 2,
      authorRole: "agency",
      authorName: "Gunery Creative Team",
      timestamp: "2026-08-13T12:30:00Z",
      text: "Para el rodaje del Miércoles 19 Ago, nosotros llevamos las frutas frescas (guanábana, papaya, maracuyá, piña y kiwi) listas para corte estético en cámara.",
      timecode: null,
      resolved: false,
      replies: [
        {
          id: "r-2-1",
          authorRole: "client",
          authorName: "Dr. Mario Pinilla (Grupo Médico)",
          timestamp: "2026-08-13T13:05:00Z",
          text: "Perfecto equipo. Tendremos disponible el consultorio #2 con buena iluminación natural a la 1:00 PM."
        }
      ]
    }
  ]
};
