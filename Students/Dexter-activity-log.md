# Dexter — Activity Log

| Date | Type | Notes |
|------|------|-------|
| 2026-03-18 | Email | Gil confirmed Cordelia for 3/19 session |
| 2026-03-19 | Email | Gil changed venue to Playground Coffee Shop (Cordelia too reservation-oriented); Dexter confirmed |
| 2026-03-19 | Session | Second lesson at Playground Coffee Shop (1114 Bedford Ave), 6:30pm |
| 2026-03-23 | Email sent | Gil proposed ZACA Cafe for Thu 3/26 |
| 2026-03-23 | Email received | Dexter confirmed ZACA for Thursday |
| 2026-03-25 | Email sent | Gil confirmed: "Confirmado! Até amanhã!" |
| 2026-03-26 | Session | Third lesson at ZACA Cafe (426 Marcus Garvey Blvd), 6:30pm |
| 2026-03-26 | Email sent | Gil sent lesson materials (~3.3MB attachment) |
| 2026-03-29 | Email received | Dexter asked to meet Tue 3/31 or Wed 4/1, 6:30-8pm |
| 2026-03-29 | Email sent | Gil replied: Tuesday works |
| 2026-03-29 | Email received | Dexter confirmed ZACA again |
| 2026-03-31 | Email received | Dexter cancelled (under the weather); proposed Tue or Thu next week |
| 2026-03-31 | Email sent | Gil replied: melhoras, Tuesday at ZACA works. Next session: Tue 4/7 at 6:30pm |
| 2026-04-06 | Email received | Dexter still sick, postponed to Tue Apr 14 at 6:30pm |
| 2026-04-06 | Email sent | Gil replied: "No problem, feel better!" |
| 2026-04-14 | Email received | Dexter cancelled day-of (asked to stay late at work); proposed Wed/Thu next week (best) or Tue |
| 2026-04-14 | Email sent | Gil: "Tuesday works!" (Tue 4/21 penciled) |
| 2026-04-20 | Email received | Dexter confirmed Tuesday 4/21 |
| 2026-04-20 | Email sent | Gil asked if Thursday 4/23 would work instead |
| 2026-04-20 | Email received | Dexter: "Thursday works great." |
| 2026-04-20 | Email sent | Gil confirmed ZACA Thu 4/23 at 6:30 PM |
| 2026-04-20 | Email received | Dexter: "6:30 is great. Obrigada!" |
| 2026-04-20 | Email sent | Gil: "Great! See you Thursday!" |
| 2026-04-23 | Session | Fourth lesson scheduled — ZACA Cafe (426 Marcus Garvey Blvd, Bed-Stuy), 6:30 PM |
| 2026-05-18 | Email sent | 8:17 PM ET (follow-up to 12:15 PM ask): "Oi Dexter, Just adding to my note from earlier — Tuesday (tomorrow) evening also works if Thursday is tight. ZACA at 6:30 either way. Let me know what fits. Abraços, Gil". Expanded the ask from Thursday-only to Tue OR Thu. Same thread "Re: Aula esta semana" (msg id 19e3d98a0a0e9e5c). |
| 2026-05-19 | Email sent | 12:27 AM ET (walkback): "Oi Dexter, Quick update — Tuesday is off after all. Thursday at ZACA, 6:30 is the plan. Let me know! Abraços, Gil". Tuesday option removed; Thursday-only standing. Same thread (msg id 19e3e7d4cc3228c5). |
| 2026-05-19 | Calendar | Deleted Tue 5/19 6:30 PM ZACA Brooklyn instance (event id `..._20260519T223000Z`, notificationLevel=NONE). Recurring series preserved. Will reconfigure the recurrence target day once Dexter confirms Thursday cadence. |
| 2026-05-19 | Email sent | 4:30 PM ET: "Perfect. Have a good week! -G" (msg `19e41ee7603d6ae2`). Acknowledges Dexter's 9:25 AM commitment to Thu 5/28 6:30 PM ZACA. Same thread "Re: Aula esta semana". |
| 2026-05-19 | Confirmation | Thu 5/28 6:30 PM at ZACA confirmed via email exchange. Time + venue locked. |
| 2026-05-19 | Calendar | Deleted Tue 5/26 6:30 PM Brooklyn recurring instance (event id `2f45bfhucjpakludgd495078pa_20260526T223000Z`, notificationLevel=NONE; status returned 'cancelled'). Created Thu 5/28 6:30–8:00 PM single event at ZACA Cafe with Dexter as attendee (new event id `47mccvbpv5jpb119f5turkdsg8`, notificationLevel=NONE). Location field dropped on create — same silent-drop bug seen on Ana's event 2026-05-18 — patched via subsequent update_event with notificationLevel=NONE. Final state verified via API response: location set, attendee set, time correct. |
