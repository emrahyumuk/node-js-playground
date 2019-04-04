const router = require('express').Router();

const algoliaSearch = require('algoliasearch');
const client = algoliaSearch('HVEMDRMP2U', '7e49e73a64282be2fe251c801a25eeaf');
const index = client.initIndex('amazona-v1');

router.get('/', (req, res, next) => {
    if (req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page - 1
        }, (err, content) => {
            res.json({
                success: true,
                message: 'Here is your search',
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }
});

module.exports = router;