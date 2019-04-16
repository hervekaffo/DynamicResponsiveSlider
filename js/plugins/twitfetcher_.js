(function($){
	$.fn.twitterFetcher = function (settings) {
	settings = jQuery.extend({
		avatar: "default",
		uniqueId: null,
		widgetid: null,
		maxTweets: 3,
		enableLinks: false,
		showRetweet: false,
		lang: "en",
		enablePermalink: false
	}, settings);

	if (typeof settings.widgetid === "undefined" || settings.widgetid === null) {
		console.error("TWITLINE: WIDGETID MUST BE DEFINED!");
		return false;
	}

	var $target = $(this);

	var strTrim = function (t, l) {
		t = t.substring(0, l);
		return(t);
	};

	window.twtCallback = function (response) {
		var datefix = function(dateString) {
			var dateStringISO = dateString.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
			d = new Date(dateStringISO);
			var hh = (d.getHours()) > 9 ?
			(d.getHours()) : "0" + (d.getHours());
			var mm = (d.getMinutes()) > 9 ?
			(d.getMinutes()) : "0" + (d.getMinutes());
			var day = (d.getDate() + 1) > 9 ?
			(d.getDate()) : "0" + (d.getDate());
			var month = d.getMonth();
			var month_it = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
			var month_en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			month = settings.lang === "it" ? month_it[month] : month_en[month];
			var d = day + " " + month + ", " + hh + ":" + mm;
			return d;
		};
		function w(a) {
			return a.replace(/<b[^>]*>(.*?)<\/b>/gi, function (a, f) {
				return f;
			}).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, "");
		}

		var list = $(response.body).find('*[data-scribe="component:tweet"]');
		var user = [], usrLnk = [], usrName = [], a = [], b = [], avatarImg = [], d = [], e = [], p = [];

		list.each(function () {
			var cur = $(this);

			user.push(cur.find("[data-scribe='element:name']").text());
			usrLnk.push(cur.find("[data-scribe='element:user_link']").attr("href"));

			var retweet = cur.find(".retweet-credit").html() != undefined;

			if (!settings.showRetweet && retweet) {
				return true;
			};

			var shortUrl = cur.find('a[data-scribe="element:url"]');
			if (shortUrl.length > 0) {
				shortUrl = shortUrl.attr("href");
                    //shortUrl = strTrim(shortUrl, 50) + "...";
                    cur.find('a[data-scribe="element:url"]').empty().append(shortUrl);
                }
                a.push(cur.find(".timeline-Tweet-text").html());
                b.push(cur.find(".data-tweet-id"));
                
                avatarImg.push(
                	settings.avatar!=="default"?
                	settings.avatar : cur.find("[data-scribe='element:avatar']").attr("data-src-1x")
                	);
                
                p.push(cur.find('[data-scribe="element:mini_timestamp"]').attr("href"));
                usrName.push(cur.find('[data-scribe="element:screen_name"]').html());
                d.push(datefix(cur.find(".dt-updated").attr("datetime")));
                e.push(""); //TODO: FIND IMAGES IN POSTS => TRY TO POST ONE TO GET THIS!
                if (a.length === parseInt(settings.maxTweets))
                	return false;
            });
		
		var html = '';
		
		for (var i = 0; i < a.length; i++) {
			html += '<div class="twt-row">\n'+
			'<a target="_blank" href="'+usrLnk[i]+'">\n'+
			usrName[i] + '\n' +
			'</a>\n&nbsp;-&nbsp;\n';
			html += '<small style="color:#666666" class="twt-date">' + d[i] + '</small>&nbsp;-&nbsp;'+ w(a[i]) + '</div>';
		}
		
		$(html).find("*").removeAttr("data-scribe");
		$target.append(html);

	};

	return this.each(function () {
		var protocol = window.location.protocol==="https:"? "https":"http"
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.src = protocol+"://cdn.syndication.twimg.com/widgets/timelines/" + settings.widgetid +"?&lang=" + (settings.lang || "en") +
		"&callback=twtCallback&suppress_response_codes=true&rnd=" +Math.random();
		c.onerror = function () {
			if (typeof settings.uniqueId === "undefined" || settings.uniqueId === null) {
				$(window).trigger("twt-error-" + settings.uniqueId);
			}
			console.warn("GET TWITS ERROR!");
		};
		c.onload = function () {
			console.info("GET TWITS OK!");
		};
		c.onreadystatechange = function () {
			console.info("RSC: ", this.status);
		};
		document.getElementsByTagName("head")[0].appendChild(c);
	});
};

})(jQuery);