export const GA_TRACKING_ID = process.env.GA_TRACKING_ID

// PV 測定
export const pageView = (url: string): void => {
    // GA_TRACKING_ID が設定されていない場合は、処理終了
    if (!GA_TRACKING_ID) return;
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    });
};

// GAイベントを発火させる関数
export const event = ({ action, category, label, value }: { action: string, category: string, label: string, value: string }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}
