// NPM IMPORTS
import { AllHtmlEntities } from 'html-entities'

const html_entities = new AllHtmlEntities()

export default {
	encode:           (x)=>html_entities.encode(x),
	encode_non_utf:   (x)=>html_entities.encodeNonUTF(x),
	encode_non_ascii: (x)=>html_entities.encodeNonASCII(x),
	decode:           (x)=>html_entities.decode(x)
}