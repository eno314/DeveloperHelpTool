import { GA_TRACKING_ID } from "@/libs/gtag";
import { randomBytes } from "crypto";
import Document, { Html, Head, Main, NextScript } from "next/document";

type WithNonceProp = {
    nonce: string;
};

export default class MyDocument extends Document<WithNonceProp> {
    static async getInitialProps(ctx: any) {
        const initialProps = await Document.getInitialProps(ctx);
        const nonce = randomBytes(128).toString("base64");
        return {
            ...initialProps,
            nonce,
        };
    }

    render() {
        const nonce = this.props.nonce;
        const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: 'nonce-${nonce}' 'strict-dynamic'`;

        return (
            <Html>
                <Head nonce={nonce}>
                    <meta httpEquiv="Content-Security-Policy" content={csp} />
                    {GA_TRACKING_ID != null && (
                        <>
                            {/* Global Site Tag (gtag.js) - Google Analytics */}
                            <script
                                async
                                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                            />
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                        window.dataLayer = window.dataLayer || [];
                                        function gtag(){dataLayer.push(arguments);}
                                        gtag('js', new Date());
                                        gtag('config', '${GA_TRACKING_ID}', {
                                            page_path: window.location.pathname,
                                        });`,
                                }}
                            />
                        </>
                    )}
                </Head>
                <body>
                    <Main />
                    <NextScript nonce={nonce} />
                </body>
            </Html>
        );
    }
}
