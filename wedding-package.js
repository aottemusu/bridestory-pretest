let loadJSON = (callback) => {
    let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null); 
}

let generateWeddingPackage = () => {
    loadJSON(function(response) {
        let actualJSON = JSON.parse(response);
        let text = ``
        actualJSON.forEach(function(wp, i) {
            text += drawWeddingPackage(wp)
        });
        document.querySelector("#packageContent").innerHTML = text
    });
}

let drawWeddingPackage = (wp) => {
    let content = ``;
    let priceBefore = wp.price
    let priceDisc = wp.discount / 100
    let countDisc = priceBefore - (priceBefore * priceDisc)
    
    content +=`<div id="wedding-package-container-${wp.id}" class="wp-container">
                    <div class="wp-image">
                        <img src="../bridestory-pretest/images/${wp.image}"/>
                        ${wp.discount > 0 ? `
                        <div class="additional-info">
                            <span class="icon-info-discount"></span>
                            Discount ${wp.discount}%
                        </div>` : 
                        ''}
                    </div>
                    <div class="wp-content">
                        <div class="wp-title">${wp.title}</div>
                            <div class="wp-price">
                                ${wp.discount > 0 ? `
                                    <span class="price-before-disc">${wp.currency} ${priceBefore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                                    <span class="price-after">${wp.currency} ${countDisc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>` : `<span class="price-before">${wp.currency} ${priceBefore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>`
                                }
                            </div>
                            <div class="wp-tools">
                                <div class="total-seen">
                                    <span class="icon icon-total-seen"></span>`
                                    let suffixes = ["", "K", "M", "B", "T"];
                                    let totalView = wp.views;
                                    if ( parseInt(totalView) >= 1000 ) {
                                        let suffixNum = Math.floor( ("" + parseInt(totalView) ).length / 3 );
                                        let shortValue = '';
                                        for ( let precision = 2; precision >= 1; precision-- ) {
                                            shortValue = parseFloat( (suffixNum !== 0 ? (parseInt(totalView) / Math.pow(1000,suffixNum) ) : parseInt(totalView)).toPrecision(precision));
                                            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                                            if (dotLessShortValue.length <= 2) { break; }
                                        }
                                        if (shortValue % 1 !== 0) {
                                            shortNum = shortValue.toFixed(1);
                                        }
                                        totalView = shortValue+suffixes[suffixNum];
                                    }
                        content += `<span class="wording-total">${totalView} Views</span>
                                </div>
                                <div class="total-like">
                                    <span class="icon icon-total-like"></span>
                                    <span class="wording-total">${wp.likes} Likes</span>
                                </div>
                                <div class="total-sold">
                                    <span class="icon icon-total-sold"></span>
                                    <span class="wording-total">${wp.sold} Sold</span>
                                </div>
                            </div>
                        </div>
                    </div>`
    return content;
}

generateWeddingPackage()