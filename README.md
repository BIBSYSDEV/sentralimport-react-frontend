This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Beskrivelse

Dette er en prototype for en reactapplikasjon for sentralimport til CRISTIN.

## Starte applikasjonen
For å starte applikasjonen kjør `npm start`. Applikasjonen vil da starte i development mode på [http://localhost:3000](http://localhost:3000) 

## Legge ut ny versjon på aws

1. Sørg for at versjonsnummeret har 3 siffer. f.eks 1.2.0. Bygg prosjektet. Dette gjøres ved å kjøre `npm run build` for prod og `npm run build:{miljø}` for de andre miljøene f.eks `npm run build:test`. Det ferdigbygde prosjektet vil da legge seg i build mappen. De forskjellige miljøene har hver sin .env fil hvor det beskrives hvordan de bygges.
2. Logg inn på relevant Sentralimport AWS konto.
3. Gå til S3 (kan søke øverst)
4. Trykk på sentralimport-frontend-{miljø}-importwebsites3bucket. Om det er fler som heter det så sjekk at filene som ligger der er de samme som i build mappen din
5. Slett alle filene i den bucket'en og last opp filene på nytt fra din build mappe (drag and drop)
7. Gå til CloudFront
8. Trykk på ID som er knyttet den bucket hvor du lastet opp den nye versjonen. S3 bucket navn står under “Origin” i Cloudfront Distribusjon
9. Trykk på 'Invalidations'
10. Trykk på 'Create Invalidation'
11. Skriv `/*` i Object Paths-feltet og trykk 'Invalidate'
12. Når invalideringen er ferdig er den nye versjonen lagt ut. Du kan sjekke at det er blitt riktig ved å se på versjonsnummer og Sist oppdatert dato nederst til høyre på nettsiden.
