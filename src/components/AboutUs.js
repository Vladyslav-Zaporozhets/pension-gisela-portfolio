// Це файл: src/components/AboutUs.js

export default function AboutUs() {
  return (
    <div className="container mx-auto p-8 pt-32">
      {" "}
      {/* pt-32 = відступ зверху через форму */}
      <h2 className="text-3xl font-bold text-center mb-6">Über uns</h2>
      <p className="max-w-3xl mx-auto text-center text-lg text-gray-700">
        Erholungssuchende und Geschäftsreisende verbringen bei uns eine
        angenehme Zeit in gepflegten Gasträumen. Unser inhabergeführtes
        Gästehaus liegt zentral im Ortskern von Gößweinstein. Kostenfreie
        Parkplätze sind direkt am Haus verfügbar. Internet per WLAN steht im
        gesamten Gäebereich kostenfrei zur Verfügung. Gute Restaurants, auch mit
        Außengastronomie, sind bei einem kurzen Spaziergang leicht zu erreichen.
      </p>
    </div>
  );
}
