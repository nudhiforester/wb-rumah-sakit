<?php
// Shared demo content for the article list and detail pages.
return json_decode(file_get_contents(__DIR__ . '/articles.json'), true, 512, JSON_THROW_ON_ERROR);
