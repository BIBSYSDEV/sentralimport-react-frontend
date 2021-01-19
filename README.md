This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Beskrivelse

Dette er en prototype for en reactapplikasjon for sentralimport til CRISTIN.

## Starte applikasjonen
For å starte applikasjonen kjør `npm start`. Applikasjonen vil da starte i development mode på [http://localhost:3000](http://localhost:3000) 

## Legge ut ny versjon på aws

1. Bygg prosjektet. Dette gjøres ved å kjøre `npm run build` for prod og `npm run build:{miljø}` for de andre miljøene f.eks `npm run build:test`. Det ferdigbygde prosjektet vil da legge seg i build mappen.
2. Logg inn på aws på det miljøet du vil legge ut ny versjon.
3. Gå til S3 (kan søke øverst)
4. Trykk på sentralimport-frontend. Om det er fler som heter det så sjekk at filene som ligger der er de samme som i build mappen din
5. Slett alle filene på sentralimport-frontend i S3 og last opp filene på nytt fra din build mappe
7. Gå til CloudFront
8. Trykk på ID'en til sentralimport-frontend 
9. Trykk på 'Invalidations'
10. Trykk på 'Create Invalidation'
11. Skriv `/*` i Object Paths-feltet og trykk 'Invalidate'
12. Når invalideringen er ferdig er den nye versjonen lagt ut. Du kan sjekke at det er blitt riktig ved å se på versjonsnummer og Sist oppdatert dato nederst til høyre på nettsiden.
