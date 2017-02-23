// Promise<boolean>
export function askToUpload(itemId: string): Promise<{
  checkedForUpdate: boolean;
  checkedForCoedit: boolean;
}> {
  return new Promise((done, reject) => {
    Item.find(itemId)
    .then(item => {
      if (item.body.length === 0) {
        Logger.log(__('Can not upload with no content'));
        return done(false);
      }

      Team.select(t => !t.local)
      .then(teams => {
        var team = _.find(teams, t => t._id === item.teamId);

        if (team._id === 'qiita') {
          if (teams.length !== 1) {
            app.popup.showUploadCheckDialog(() => {
              app.popup.close();
              done({});
            }, () => {
              app.popup.close();
              done(false);
            });
          } else {
            var message = __('Are you sure to upload this item?');
            app.popup.showWithChoices(message + ' : ' + item.title, [
              {
                text: __('Yes'),
                type: 'positive',
                onSelect: () => {
                  app.popup.close();
                  done({});
                }
              },
              {
                text: __('No'),
                onSelect: () => {
                  app.popup.close();
                  done(false);
                }
              }
            ]);
          }
        } else {
          app.popup.showUploadCheckDialogForTeam(state => {
            app.popup.close();
            done(state);
          }, () => {
            app.popup.close();
            done(false);
          });
        }
      });
    });
  });
}

export function tryToUpload(itemId: string, options: {coediting?: boolean;}) {
  return new Promise((done, reject) => {
    Item.find(itemId)
    .then(item => {
      var teamId = item.teamId;

      // update
      if (item.syncedItemId) {
        app.popup.showLoader('Now Uploading...');

        kobito.qiita.fetchItem(
          teamId,
          item.syncedItemId
        )
        .then((qItem: Qiita.Entities.Item) => {
          return kobito.commands.sync.syncItem(qItem, teamId);
        })
        .then(result => {
          if (
            result.result === kobito.commands.sync.SyncItemResultStatus.UPDATE ||
            result.result === kobito.commands.sync.SyncItemResultStatus.CONFLICT
          ) {
            return (<any>reject)(new Error('conflict detected'));
          }

          return kobito.qiita.updateItem(
            item._id,
            teamId
          );
        })
        .then(() => {
          app.popup.close();
          Logger.log(__('uploaded: {}', item.title));
          done(true);
        })
        .catch((error) => {
          app.popup.close();
          Logger.log(__('upload failed'));
          console.error(error);
          done(false);
        });
      } else {
        // upload
        app.popup.showLoader('Now Loading...');
        kobito.qiita.createItem(itemId, teamId, {
          coediting: options.coediting
        })
        .then(() => {
          app.popup.close();
          Logger.log(__('uploaded: {}', item.title));
          done(true);
        })
        .catch(err => {
          app.popup.close();
          Logger.log(__('upload failed'));
          console.error(err);
          reject(new Error('upload failed'));
        });
      }
    });
  });
}
