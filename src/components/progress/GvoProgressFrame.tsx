import "./GvoProgressFrame.css";

type GvoProgressFrameAsset = {
  id: string;
  urls: {
    png: string;
    webp: string;
  };
};

type GvoProgressFrameProps = {
  fillAsset: GvoProgressFrameAsset;
  sparkAsset: GvoProgressFrameAsset;
  testIdPrefix: string;
  trackAsset: GvoProgressFrameAsset;
};

export function GvoProgressFrame({
  fillAsset,
  sparkAsset,
  testIdPrefix,
  trackAsset,
}: GvoProgressFrameProps) {
  return (
    <span
      className="gvo-progress-frame"
      data-testid={`${testIdPrefix}-real`}
      data-progress-family="transition-root-assets"
      aria-hidden="true"
    >
      <span className="gvo-progress-frame__fill-clip">
        <picture
          className="gvo-progress-frame__fill-picture"
          data-testid={`${testIdPrefix}-fill`}
          data-asset-id={fillAsset.id}
        >
          <source srcSet={fillAsset.urls.webp} type="image/webp" />
          <img
            src={fillAsset.urls.png}
            alt=""
            draggable={false}
            decoding="async"
          />
        </picture>
      </span>
      <picture
        className="gvo-progress-frame__track-picture"
        data-testid={`${testIdPrefix}-track`}
        data-asset-id={trackAsset.id}
      >
        <source srcSet={trackAsset.urls.webp} type="image/webp" />
        <img
          src={trackAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
      <picture
        className="gvo-progress-frame__spark-picture"
        data-testid={`${testIdPrefix}-spark`}
        data-asset-id={sparkAsset.id}
      >
        <source srcSet={sparkAsset.urls.webp} type="image/webp" />
        <img
          src={sparkAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
    </span>
  );
}
