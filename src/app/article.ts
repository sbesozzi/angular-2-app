export class Article {
  public publishedAt: Date;

  // Define instance variables inside constructor & value of attributes on model
  constructor(
    public title: string,
    public description: string,
    // Optional ?
    public votes?: number
  ) {
    // votes = votes or 0
    this.votes = votes || 0;
    this.publishedAt = new Date();
  }

  public voteUp(): void {
    this.votes = this.votes + 1;
  }

  public voteDown(): void {
    this.votes = this.votes - 1;
  }

}
