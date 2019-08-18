export interface getListQuery {
  /**
  action
  Default: list
  */
  ac?: string;

  /**
  返回数据类型
  Default: xml
  */
  at?: string;

  /**
  类别ID
  */
  t?: string;

  /**
  页码
  */
  pg?: string;

  /**
  搜索关键字
  */
  wd?: string;

  /**
  几小时内的数据
  */
  h?: string;
}

export function getList(apt: string, query: getListQuery): Promise<any>;

export interface getDetailQuery {
  /**
  action
  Default: detail
  */
  ac?: string;

  /**
  返回数据类型
  Default: xml
  */
  at?: string;

  /**
  类别ID
  */
  t?: string;

  /**
  页码
  */
  pg?: string;

  /**
  数据ID,多个ID逗号分割
  */
  ids?: string;

  /**
  几小时内的数据
  */
  h?: string;
}

export function getDetail(apt: string, query: getDetailQuery): Promise<any>;
