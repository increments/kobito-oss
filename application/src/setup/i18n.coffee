# i18n
translate = do ->
  lang = navigator?.language?.split('-')[0] ? 'en' # Ignore en-US and en-UK
  ja = require '../fixtures/languages/ja'
  en = require '../fixtures/languages/en'

  (text) ->
    hit =
      switch lang
        when 'ja' then ja[text]
        when 'en' then en[text]
    hit ? text

global.__ = (text, args...) ->
  text = translate(text)
  text.replace /\{\}/g, (match) ->
    args.shift() ? '{}'
