///<reference path='../typings/bundle.d.ts' />
///<reference path='stone-skin.d.ts' />
///<reference path='../../node_modules/qiita-js/dist/qiita.d.ts' />

///<reference path='entities/tag.ts' />
///<reference path='entities/group.ts' />
///<reference path='entities/item.ts' />
///<reference path='entities/team.ts' />
///<reference path='entities/template.ts' />

///<reference path='types.d.ts' />

///<reference path='storages/schema/v2/item.ts' />
///<reference path='storages/schema/v2/log.ts' />
///<reference path='storages/schema/v2/team.ts' />
///<reference path='storages/schema/v2/template.ts' />
///<reference path='storages/schema/v2/username.ts' />

///<reference path='storages/item.ts' />
///<reference path='storages/log.ts' />
///<reference path='storages/team.ts' />
///<reference path='storages/template.ts' />
///<reference path='storages/username.ts' />
///<reference path='storages/migrators/migrate1to2.ts' />

///<reference path='simple-storage/index.ts' />
///<reference path='storages/singletons/config.ts' />
///<reference path='utils/compile-markdown.ts' />

///<reference path='commands/ensure-user-id.ts' />

///<reference path='qiita/set-endpoint.ts' />
///<reference path='queries/is-local-team.ts' />
///<reference path='queries/collect-tag-names.ts' />
///<reference path='queries/build-tags.ts' />

///<reference path='qiita/fetch-login-user-items.ts' />
///<reference path='qiita/fetch-item.ts' />
///<reference path='qiita/fetch-groups.ts' />
///<reference path='qiita/fetch-teams.ts' />
///<reference path='qiita/fetch-templates.ts' />
///<reference path='qiita/fetch-usernames.ts' />
///<reference path='qiita/fetch-expanded-template.ts' />
///<reference path='qiita/create-item.ts' />
///<reference path='qiita/update-item.ts' />

///<reference path='queries/get-team-ids.ts' />
///<reference path='queries/build-timeline.ts' />
///<reference path='queries/get-neibor-item-on-timeline.ts' />
///<reference path='queries/detect-removed-team-ids.ts' />

///<reference path='commands/initialize/init-storages.ts' />
///<reference path='commands/initialize/ensure-initial-databases.ts' />
///<reference path='commands/initialize/setup-with-token.ts' />
///<reference path='commands/initialize/setup-without-token.ts' />
///<reference path='commands/initialize/setup-at-first-login.ts' />
///<reference path='commands/create-new-item.ts' />
///<reference path='commands/delete-item.ts' />
///<reference path='commands/delete-items-in-trash.ts' />
///<reference path='commands/update-item.ts' />
///<reference path='commands/transfer-item-to-other-team.ts' />
///<reference path='commands/recover-from-trash.ts' />
///<reference path='commands/send-to-trash.ts' />
///<reference path='commands/make-coedit.ts' />
///<reference path='commands/sync/sync-items.ts' />
///<reference path='commands/sync/sync-templates.ts' />
///<reference path='commands/sync/sync-teams.ts' />
///<reference path='commands/sync/sync-teams-and-templates.ts' />

//export = kaita;*/
(<any>module).exports = kaita;
