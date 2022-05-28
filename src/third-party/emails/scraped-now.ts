const scrapedNowEmail = (
  name: string,
  url: string,
  price: string,
  previousPrice: string,
) => {
  return `
  <td class="esd-stripe" align="center">
  <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
      <td class="esd-block-image es-p20b" style="font-size: 0px;" align="center">
          <a target="_blank"><img
                  src="https://jikdpb.stripocdn.email/content/guids/CABINET_0307ef087ed932f22bc8c92ac36d7822/images/untitled1.png"
                  alt="Logo" style="display: block; font-size: 12px;" title="Logo" width="200"></a>
      </td>
      <tbody>
          <tr>
              <td class="esd-structure es-p30t es-p10b es-p20r es-p20l" align="left">
                  <table width="100%" cellspacing="0" cellpadding="0">
                      <tbody>
                          <tr>
                              <td class="esd-container-frame" width="560" valign="top" align="center">
                                  <table width="100%" cellspacing="0" cellpadding="0">
                                      <tbody>
                                          <tr>
                                              <td class="esd-block-text es-p10b es-m-txt-c" align="center">
                                                  <h1 style="font-size: 46px; line-height: 100%;"><b>${name}</b></h1>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td class="esd-block-text es-p10t es-p10b es-m-txt-c" align="center">
                                                  <h1><strong>Price History</strong></h1>
                                                  <h2><strong>Before: ${previousPrice}</strong></h2>
                                                  <h2><strong>Now: ${price}</strong></h2>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td class="esd-block-button" align="center"> <span
                                                      class="es-button-border">
                                                      <a href="${url}"
                                                          class="es-button" target="_blank">Product Page</a>
                                                  </span> </td>
                                          </tr>
                                          <tr>
                                              <td class="esd-block-button" align="center"> <span
                                                      class="es-button-border">
                                                      <a href="https://github.com/flav1o/scraper-pcdiga"
                                                          class="es-button" target="_blank">Project Code</a>
                                                  </span> </td>
                                          </tr>
                                          <tr>
                                              <td class="esd-block-text es-p5t es-p5b es-p5r es-m-p0r" align="left">
                                                  <p>Kind regards,</p>
                                                  <p>flav1o - PcDiga Scraper</p>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>
</td>
    `;
};

export default scrapedNowEmail;
